import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { BudgetCategory } from '../types/budget';

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
  }) => void;
  onClose: () => void;
  categories: BudgetCategory[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onClose,
  categories
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredCategories = categories.filter(cat => {
    if (type === 'income') {
      return ['allowance', 'job', 'chores', 'gifts', 'side-hustle', 'other-income'].includes(cat.id);
    } else {
      return ['food', 'fun', 'shopping', 'transport', 'education', 'health', 'subscriptions', 'other'].includes(cat.id);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) return;
    
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Add Transaction</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-1">💰</div>
                  <div className="font-semibold">Income</div>
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="text-2xl mb-1">💸</div>
                  <div className="font-semibold">Expense</div>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      category === cat.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="What was this for?"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!amount || !category || !description}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};