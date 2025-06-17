import React, { useState } from 'react';
import { Trash2, Calendar, Filter } from 'lucide-react';
import { Transaction, BudgetCategory } from '../types/budget';

interface TransactionListProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onDeleteTransaction
}) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: categoryId,
      icon: '💰',
      color: 'from-gray-400 to-gray-600'
    };
  };

  const filteredTransactions = transactions
    .filter(transaction => filter === 'all' || transaction.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'income', label: 'Income' },
                { id: 'expense', label: 'Expenses' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === option.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No transactions yet</h3>
            <p className="text-gray-600">Start tracking your income and expenses!</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const categoryInfo = getCategoryInfo(transaction.category);
            return (
              <div
                key={transaction.id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryInfo.color}`}>
                      <span className="text-xl">{categoryInfo.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(transaction.date)}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {categoryInfo.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                      <div className={`text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'income' ? 'Income' : 'Expense'}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};