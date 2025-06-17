import { supabase } from '../../supabase-client';
import { CreateTransactionData, Transaction } from '../types/database';

/**
 * Add a new budget entry to Supabase
 * @param entryData - The budget entry data
 * @returns Promise<Transaction> - The created transaction
 */
export const addBudgetEntry = async (entryData: CreateTransactionData): Promise<Transaction> => {
  try {
    // Validate the entry data
    const validationError = validateBudgetEntry(entryData);
    if (validationError) {
      throw new Error(validationError);
    }

    // Format the data
    const formattedData = formatBudgetEntry(entryData);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([formattedData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add budget entry: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error adding budget entry:', error);
    throw error;
  }
};

/**
 * Add multiple budget entries at once
 * @param entries - Array of budget entry data
 * @returns Promise<Transaction[]> - Array of created transactions
 */
export const addMultipleBudgetEntries = async (entries: CreateTransactionData[]): Promise<Transaction[]> => {
  try {
    // Validate all entries
    for (const entry of entries) {
      const validationError = validateBudgetEntry(entry);
      if (validationError) {
        throw new Error(`Invalid entry "${entry.description}": ${validationError}`);
      }
    }

    // Format all entries
    const formattedEntries = entries.map(formatBudgetEntry);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert(formattedEntries)
      .select();

    if (error) {
      throw new Error(`Failed to add budget entries: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error adding multiple budget entries:', error);
    throw error;
  }
};

/**
 * Validate budget entry data
 * @param entryData - The budget entry data to validate
 * @returns string | null - Error message or null if valid
 */
export const validateBudgetEntry = (entryData: CreateTransactionData): string | null => {
  // Check required fields
  if (!entryData.description || entryData.description.trim().length === 0) {
    return 'Description is required';
  }

  if (!entryData.amount || entryData.amount <= 0) {
    return 'Amount must be greater than 0';
  }

  if (!entryData.category || entryData.category.trim().length === 0) {
    return 'Category is required';
  }

  if (!entryData.transaction_type || !['income', 'expense'].includes(entryData.transaction_type)) {
    return 'Transaction type must be either "income" or "expense"';
  }

  // Validate description length
  if (entryData.description.length > 255) {
    return 'Description must be less than 255 characters';
  }

  // Validate amount precision
  if (entryData.amount.toString().includes('.') && entryData.amount.toString().split('.')[1].length > 2) {
    return 'Amount can have maximum 2 decimal places';
  }

  // Validate date format
  if (entryData.date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(entryData.date)) {
      return 'Date must be in YYYY-MM-DD format';
    }

    const date = new Date(entryData.date);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    // Check if date is not in the future (optional validation)
    if (date > new Date()) {
      return 'Date cannot be in the future';
    }
  }

  return null;
};

/**
 * Format budget entry data for database insertion
 * @param entryData - The raw budget entry data
 * @returns CreateTransactionData - Formatted data
 */
export const formatBudgetEntry = (entryData: CreateTransactionData): CreateTransactionData => {
  return {
    description: entryData.description.trim(),
    amount: Math.round(entryData.amount * 100) / 100, // Ensure 2 decimal places
    category: entryData.category.trim(),
    transaction_type: entryData.transaction_type,
    date: entryData.date || new Date().toISOString().split('T')[0]
  };
};

/**
 * Get budget entry statistics
 * @param userId - The user ID
 * @param startDate - Start date for filtering
 * @param endDate - End date for filtering
 * @returns Promise<object> - Statistics object
 */
export const getBudgetEntryStats = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  categoryBreakdown: Record<string, number>;
}> => {
  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get budget stats: ${error.message}`);
    }

    const transactions = data || [];

    // Calculate statistics
    const totalIncome = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netAmount = totalIncome - totalExpenses;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    transactions.forEach(transaction => {
      const key = `${transaction.category}_${transaction.transaction_type}`;
      categoryBreakdown[key] = (categoryBreakdown[key] || 0) + transaction.amount;
    });

    return {
      totalIncome,
      totalExpenses,
      netAmount,
      transactionCount: transactions.length,
      categoryBreakdown
    };
  } catch (error) {
    console.error('Error getting budget stats:', error);
    throw error;
  }
};

/**
 * Export budget entries to CSV format
 * @param transactions - Array of transactions
 * @returns string - CSV formatted string
 */
export const exportBudgetEntriesToCSV = (transactions: Transaction[]): string => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    t.date,
    t.description,
    t.category,
    t.transaction_type,
    t.amount.toString()
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
};

/**
 * Import budget entries from CSV format
 * @param csvContent - CSV formatted string
 * @returns CreateTransactionData[] - Array of budget entry data
 */
export const importBudgetEntriesFromCSV = (csvContent: string): CreateTransactionData[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const entries: CreateTransactionData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    const entry: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      switch (header.toLowerCase()) {
        case 'date':
          entry.date = value;
          break;
        case 'description':
          entry.description = value;
          break;
        case 'category':
          entry.category = value;
          break;
        case 'type':
          entry.transaction_type = value.toLowerCase();
          break;
        case 'amount':
          entry.amount = parseFloat(value) || 0;
          break;
      }
    });

    // Validate the entry
    const validationError = validateBudgetEntry(entry);
    if (!validationError) {
      entries.push(entry);
    } else {
      console.warn(`Skipping invalid entry on line ${i + 1}: ${validationError}`);
    }
  }

  return entries;
}; 