import React, { useState } from 'react';
import { Plus, Upload, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useBudgetEntries } from '../hooks/useBudgetEntries';
import { CreateTransactionData } from '../types/database';

export const BudgetEntryExample: React.FC = () => {
  const {
    addEntry,
    addQuickExpense,
    addQuickIncome,
    addMultipleEntries,
    addRecurringEntry,
    getStats,
    exportToCSV,
    importFromCSV,
    validateEntry,
    isAdding,
    isAddingMultiple,
    error,
    clearError
  } = useBudgetEntries();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateTransactionData>({
    description: '',
    amount: 0,
    category: '',
    transaction_type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [stats, setStats] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateEntry(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    const result = await addEntry(formData);
    if (result) {
      alert('Budget entry added successfully!');
      setShowForm(false);
      setFormData({
        description: '',
        amount: 0,
        category: '',
        transaction_type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleQuickExpense = async () => {
    const result = await addQuickExpense('Coffee', 5.50, 'Food & Dining');
    if (result) {
      alert('Quick expense added!');
    }
  };

  const handleQuickIncome = async () => {
    const result = await addQuickIncome('Freelance Work', 150.00, 'Freelance');
    if (result) {
      alert('Quick income added!');
    }
  };

  const handleAddMultiple = async () => {
    const entries: CreateTransactionData[] = [
      {
        description: 'Grocery Shopping',
        amount: 75.50,
        category: 'Food & Dining',
        transaction_type: 'expense',
        date: new Date().toISOString().split('T')[0]
      },
      {
        description: 'Gas Station',
        amount: 45.00,
        category: 'Transportation',
        transaction_type: 'expense',
        date: new Date().toISOString().split('T')[0]
      },
      {
        description: 'Side Project Payment',
        amount: 300.00,
        category: 'Freelance',
        transaction_type: 'income',
        date: new Date().toISOString().split('T')[0]
      }
    ];

    const results = await addMultipleEntries(entries);
    if (results.length > 0) {
      alert(`Added ${results.length} entries successfully!`);
    }
  };

  const handleAddRecurring = async () => {
    const entryData: CreateTransactionData = {
      description: 'Monthly Rent',
      amount: 1200.00,
      category: 'Housing',
      transaction_type: 'expense',
      date: new Date().toISOString().split('T')[0]
    };

    const results = await addRecurringEntry(entryData, 'monthly', '2024-12-31');
    if (results.length > 0) {
      alert(`Added ${results.length} recurring entries!`);
    }
  };

  const handleGetStats = async () => {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const statsResult = await getStats(
      startOfMonth.toISOString().split('T')[0],
      endOfMonth.toISOString().split('T')[0]
    );

    if (statsResult) {
      setStats(statsResult);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string;
        const entries = importFromCSV(csvContent);
        
        if (entries.length > 0) {
          const results = await addMultipleEntries(entries);
          alert(`Imported ${results.length} entries from CSV!`);
        } else {
          alert('No valid entries found in CSV file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Entry Examples</h1>
        <p className="text-gray-600">Demonstrating various ways to add budget entries</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setShowForm(true)}
          disabled={isAdding}
          className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Add Entry
        </button>

        <button
          onClick={handleQuickExpense}
          disabled={isAdding}
          className="flex items-center justify-center gap-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          <TrendingDown className="w-5 h-5" />
          Quick Expense
        </button>

        <button
          onClick={handleQuickIncome}
          disabled={isAdding}
          className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <TrendingUp className="w-5 h-5" />
          Quick Income
        </button>

        <button
          onClick={handleGetStats}
          className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Get Stats
        </button>
      </div>

      {/* Advanced Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleAddMultiple}
          disabled={isAddingMultiple}
          className="flex items-center justify-center gap-2 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
        >
          Add Multiple Entries
        </button>

        <button
          onClick={handleAddRecurring}
          disabled={isAddingMultiple}
          className="flex items-center justify-center gap-2 p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Add Recurring Entry
        </button>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600 mb-2">Upload CSV file to import multiple entries</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>

      {/* Stats Display */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Budget Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">${stats.totalExpenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Amount</p>
              <p className={`text-xl font-bold ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.netAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-xl font-bold text-blue-600">{stats.transactionCount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Budget Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.transaction_type}
                  onChange={(e) => setFormData({...formData, transaction_type: e.target.value as 'income' | 'expense'})}
                  className="w-full p-2 border rounded"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 p-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 p-2 bg-purple-600 text-white rounded disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 