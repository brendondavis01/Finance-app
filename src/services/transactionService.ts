import { supabase } from '../supabase-client';
import { 
  Transaction, 
  Category, 
  BudgetGoal, 
  TransactionSummary,
  CreateTransactionData,
  UpdateTransactionData,
  CreateBudgetGoalData,
  UpdateBudgetGoalData
} from '../types/database';

// Transaction operations
export const transactionService = {
  // Get all transactions for the current user
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get transactions for a specific month
  async getTransactionsByMonth(year: number, month: number): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create a new transaction
  async createTransaction(transactionData: CreateTransactionData): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a transaction
  async updateTransaction(id: string, updateData: UpdateTransactionData): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get transaction summary for a month
  async getTransactionSummary(year: number, month: number): Promise<TransactionSummary[]> {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('transaction_summary')
      .select('*')
      .gte('month', startDate)
      .lte('month', endDate);

    if (error) throw error;
    return data || [];
  }
};

// Category operations
export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Get categories by type
  async getCategoriesByType(type: 'income' | 'expense'): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('type', type)
      .order('name');

    if (error) throw error;
    return data || [];
  }
};

// Budget goal operations
export const budgetGoalService = {
  // Get all budget goals for the current user
  async getBudgetGoals(): Promise<BudgetGoal[]> {
    const { data, error } = await supabase
      .from('budget_goals')
      .select('*')
      .order('category');

    if (error) throw error;
    return data || [];
  },

  // Create a budget goal
  async createBudgetGoal(goalData: CreateBudgetGoalData): Promise<BudgetGoal> {
    const { data, error } = await supabase
      .from('budget_goals')
      .insert([goalData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a budget goal
  async updateBudgetGoal(category: string, updateData: UpdateBudgetGoalData): Promise<BudgetGoal> {
    const { data, error } = await supabase
      .from('budget_goals')
      .update(updateData)
      .eq('category', category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a budget goal
  async deleteBudgetGoal(category: string): Promise<void> {
    const { error } = await supabase
      .from('budget_goals')
      .delete()
      .eq('category', category);

    if (error) throw error;
  }
};