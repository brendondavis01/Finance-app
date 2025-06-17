export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  category: string;
  transaction_type: 'income' | 'expense';
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  created_at: string;
}

export interface BudgetGoal {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionSummary {
  user_id: string;
  month: string;
  category: string;
  transaction_type: 'income' | 'expense';
  total_amount: number;
  transaction_count: number;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  category: string;
  transaction_type: 'income' | 'expense';
  date?: string;
}

export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  category?: string;
  transaction_type?: 'income' | 'expense';
  date?: string;
}

export interface CreateBudgetGoalData {
  category: string;
  monthly_limit: number;
}

export interface UpdateBudgetGoalData {
  monthly_limit: number;
} 