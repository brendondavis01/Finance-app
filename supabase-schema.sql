-- Enable Row Level Security
ALTER TABLE IF EXISTS transactions ENABLE ROW LEVEL SECURITY;

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Policy 1: Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can only insert their own transactions
CREATE POLICY "Users can insert own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can only update their own transactions
CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy 4: Users can only delete their own transactions
CREATE POLICY "Users can delete own transactions" ON transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Create categories table for better data consistency
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT '💰',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, type, color, icon) VALUES
    ('Salary', 'income', '#10B981', '💰'),
    ('Freelance', 'income', '#10B981', '💼'),
    ('Investment', 'income', '#10B981', '📈'),
    ('Other Income', 'income', '#10B981', '➕'),
    ('Food & Dining', 'expense', '#EF4444', '🍽️'),
    ('Transportation', 'expense', '#F59E0B', '🚗'),
    ('Shopping', 'expense', '#8B5CF6', '🛍️'),
    ('Entertainment', 'expense', '#EC4899', '🎬'),
    ('Healthcare', 'expense', '#06B6D4', '🏥'),
    ('Housing', 'expense', '#84CC16', '🏠'),
    ('Utilities', 'expense', '#F97316', '⚡'),
    ('Education', 'expense', '#6366F1', '📚'),
    ('Other Expense', 'expense', '#6B7280', '📝')
ON CONFLICT (name) DO NOTHING;

-- Create budget_goals table for user budget targets
CREATE TABLE IF NOT EXISTS budget_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    category TEXT NOT NULL,
    monthly_limit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category)
);

-- Enable RLS on budget_goals
ALTER TABLE budget_goals ENABLE ROW LEVEL SECURITY;

-- Create trigger for budget_goals updated_at
CREATE TRIGGER update_budget_goals_updated_at 
    BEFORE UPDATE ON budget_goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for budget_goals
CREATE POLICY "Users can view own budget goals" ON budget_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget goals" ON budget_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget goals" ON budget_goals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget goals" ON budget_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create a view for transaction summaries
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) as month,
    category,
    transaction_type,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', date), category, transaction_type;

-- Grant access to the view
GRANT SELECT ON transaction_summary TO authenticated; 