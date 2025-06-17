export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budgetLimit?: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  icon: string;
  color: string;
  deadline?: string;
  createdAt: string;
  completed: boolean;
}

export interface LearningActivity {
  id: string;
  date: string;
  type: 'quiz' | 'lesson' | 'goal_created' | 'transaction_added' | 'budget_set';
  description: string;
  points: number;
}

export interface BudgetData {
  transactions: Transaction[];
  monthlyBudget: number;
  categories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  learningActivities: LearningActivity[];
  lastActiveDate?: string;
}