import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { 
  addBudgetEntry, 
  addMultipleBudgetEntries, 
  getBudgetEntryStats,
  exportBudgetEntriesToCSV,
  importBudgetEntriesFromCSV,
  validateBudgetEntry
} from '../utils/budgetEntryUtils';
import { CreateTransactionData, Transaction } from '../types/database';

export const useBudgetEntries = () => {
  const { isSignedIn, user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add a single budget entry
   */
  const addEntry = useCallback(async (entryData: CreateTransactionData): Promise<Transaction | null> => {
    if (!isSignedIn || !user) {
      setError('You must be signed in to add budget entries');
      return null;
    }

    setIsAdding(true);
    setError(null);

    try {
      const transaction = await addBudgetEntry(entryData);
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add budget entry';
      setError(errorMessage);
      return null;
    } finally {
      setIsAdding(false);
    }
  }, [isSignedIn, user]);

  /**
   * Add multiple budget entries at once
   */
  const addMultipleEntries = useCallback(async (entries: CreateTransactionData[]): Promise<Transaction[]> => {
    if (!isSignedIn || !user) {
      setError('You must be signed in to add budget entries');
      return [];
    }

    if (entries.length === 0) {
      setError('No entries provided');
      return [];
    }

    setIsAddingMultiple(true);
    setError(null);

    try {
      const transactions = await addMultipleBudgetEntries(entries);
      return transactions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add budget entries';
      setError(errorMessage);
      return [];
    } finally {
      setIsAddingMultiple(false);
    }
  }, [isSignedIn, user]);

  /**
   * Get budget statistics for a date range
   */
  const getStats = useCallback(async (
    startDate?: string,
    endDate?: string
  ) => {
    if (!isSignedIn || !user) {
      setError('You must be signed in to view budget statistics');
      return null;
    }

    try {
      setError(null);
      const stats = await getBudgetEntryStats(user.id, startDate, endDate);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get budget statistics';
      setError(errorMessage);
      return null;
    }
  }, [isSignedIn, user]);

  /**
   * Export transactions to CSV
   */
  const exportToCSV = useCallback((transactions: Transaction[]): string => {
    try {
      return exportBudgetEntriesToCSV(transactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export to CSV';
      setError(errorMessage);
      return '';
    }
  }, []);

  /**
   * Import transactions from CSV
   */
  const importFromCSV = useCallback((csvContent: string): CreateTransactionData[] => {
    try {
      setError(null);
      return importBudgetEntriesFromCSV(csvContent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import from CSV';
      setError(errorMessage);
      return [];
    }
  }, []);

  /**
   * Validate a single budget entry
   */
  const validateEntry = useCallback((entryData: CreateTransactionData): string | null => {
    return validateBudgetEntry(entryData);
  }, []);

  /**
   * Clear any error messages
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Create a quick expense entry
   */
  const addQuickExpense = useCallback(async (
    description: string,
    amount: number,
    category: string
  ): Promise<Transaction | null> => {
    const entryData: CreateTransactionData = {
      description,
      amount,
      category,
      transaction_type: 'expense',
      date: new Date().toISOString().split('T')[0]
    };

    return await addEntry(entryData);
  }, [addEntry]);

  /**
   * Create a quick income entry
   */
  const addQuickIncome = useCallback(async (
    description: string,
    amount: number,
    category: string
  ): Promise<Transaction | null> => {
    const entryData: CreateTransactionData = {
      description,
      amount,
      category,
      transaction_type: 'income',
      date: new Date().toISOString().split('T')[0]
    };

    return await addEntry(entryData);
  }, [addEntry]);

  /**
   * Add a recurring budget entry (for future implementation)
   */
  const addRecurringEntry = useCallback(async (
    entryData: CreateTransactionData,
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly',
    endDate?: string
  ): Promise<Transaction[]> => {
    if (!isSignedIn || !user) {
      setError('You must be signed in to add recurring entries');
      return [];
    }

    setIsAddingMultiple(true);
    setError(null);

    try {
      const entries: CreateTransactionData[] = [];
      const startDate = new Date(entryData.date || new Date().toISOString().split('T')[0]);
      const end = endDate ? new Date(endDate) : new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());

      let currentDate = new Date(startDate);

      while (currentDate <= end) {
        entries.push({
          ...entryData,
          date: currentDate.toISOString().split('T')[0]
        });

        // Increment date based on frequency
        switch (frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }

      const transactions = await addMultipleBudgetEntries(entries);
      return transactions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add recurring entries';
      setError(errorMessage);
      return [];
    } finally {
      setIsAddingMultiple(false);
    }
  }, [isSignedIn, user, addMultipleBudgetEntries]);

  return {
    // State
    isAdding,
    isAddingMultiple,
    error,
    isSignedIn,

    // Actions
    addEntry,
    addMultipleEntries,
    addQuickExpense,
    addQuickIncome,
    addRecurringEntry,
    getStats,
    exportToCSV,
    importFromCSV,
    validateEntry,
    clearError
  };
}; 