import { useState, useEffect, useCallback } from 'react';
import { transactionService, categoryService, budgetGoalService } from '../services/transactionService';
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

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, categoriesData, budgetGoalsData] = await Promise.all([
        transactionService.getTransactions(),
        categoryService.getCategories(),
        budgetGoalService.getBudgetGoals()
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setBudgetGoals(budgetGoalsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Transaction operations
  const addTransaction = useCallback(async (transactionData: CreateTransactionData) => {
    try {
      setError(null);
      const newTransaction = await transactionService.createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, updateData: UpdateTransactionData) => {
    try {
      setError(null);
      const updatedTransaction = await transactionService.updateTransaction(id, updateData);
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
      );
      return updatedTransaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      setError(null);
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
      throw err;
    }
  }, []);

  // Budget goal operations
  const addBudgetGoal = useCallback(async (goalData: CreateBudgetGoalData) => {
    try {
      setError(null);
      const newGoal = await budgetGoalService.createBudgetGoal(goalData);
      setBudgetGoals(prev => [...prev, newGoal]);
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add budget goal');
      throw err;
    }
  }, []);

  const updateBudgetGoal = useCallback(async (category: string, updateData: UpdateBudgetGoalData) => {
    try {
      setError(null);
      const updatedGoal = await budgetGoalService.updateBudgetGoal(category, updateData);
      setBudgetGoals(prev => 
        prev.map(goal => 
          goal.category === category ? updatedGoal : goal
        )
      );
      return updatedGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget goal');
      throw err;
    }
  }, []);

  const deleteBudgetGoal = useCallback(async (category: string) => {
    try {
      setError(null);
      await budgetGoalService.deleteBudgetGoal(category);
      setBudgetGoals(prev => prev.filter(goal => goal.category !== category));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete budget goal');
      throw err;
    }
  }, []);

  // Utility functions
  const getTransactionsByMonth = useCallback(async (year: number, month: number) => {
    try {
      setError(null);
      return await transactionService.getTransactionsByMonth(year, month);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      throw err;
    }
  }, []);

  const getTransactionSummary = useCallback(async (year: number, month: number) => {
    try {
      setError(null);
      return await transactionService.getTransactionSummary(year, month);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transaction summary');
      throw err;
    }
  }, []);

  const getCategoriesByType = useCallback((type: 'income' | 'expense') => {
    return categories.filter(category => category.type === type);
  }, [categories]);

  // Calculate totals
  const getTotalIncome = useCallback(() => {
    return transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getTotalExpenses = useCallback(() => {
    return transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getNetAmount = useCallback(() => {
    return getTotalIncome() - getTotalExpenses();
  }, [getTotalIncome, getTotalExpenses]);

  return {
    // Data
    transactions,
    categories,
    budgetGoals,
    loading,
    error,
    
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal,
    
    // Utilities
    getTransactionsByMonth,
    getTransactionSummary,
    getCategoriesByType,
    getTotalIncome,
    getTotalExpenses,
    getNetAmount,
    
    // Refresh
    refresh: loadData
  };
}; 