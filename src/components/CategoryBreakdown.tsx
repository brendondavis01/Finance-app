import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Transaction, BudgetCategory } from '../types/budget';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  categories: BudgetCategory[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  transactions,
  categories
}) => {
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || {
      name: categoryId,
      icon: '💰',
      color: 'from-gray-400 to-gray-600'
    };
  };

  // Calculate spending by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Calculate income by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  const totalIncome = Object.values(incomeByCategory).reduce((sum, amount) => sum + amount, 0);

  const expenseCategories = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => ({
      ...getCategoryInfo(categoryId),
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  const incomeCategories = Object.entries(incomeByCategory)
    .map(([categoryId, amount]) => ({
      ...getCategoryInfo(categoryId),
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Expenses Breakdown */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-red-400 to-red-500 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Expense Breakdown</h2>
          <span className="text-lg text-gray-600">
            (${totalExpenses.toFixed(2)} total)
          </span>
        </div>

        {expenseCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No expenses yet</h3>
            <p className="text-gray-600">Start tracking your spending to see the breakdown!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expenseCategories.map((category) => (
              <div key={category.id} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category.percentage.toFixed(1)}% of total expenses
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-600">
                      ${category.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Income Breakdown */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Income Breakdown</h2>
          <span className="text-lg text-gray-600">
            (${totalIncome.toFixed(2)} total)
          </span>
        </div>

        {incomeCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No income recorded yet</h3>
            <p className="text-gray-600">Add your income sources to see the breakdown!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomeCategories.map((category) => (
              <div key={category.id} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {category.percentage.toFixed(1)}% of total income
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      ${category.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Spending Insights */}
      {expenseCategories.length > 0 && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Spending Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-2">Top Spending Category</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{expenseCategories[0].icon}</span>
                <div>
                  <div className="font-semibold">{expenseCategories[0].name}</div>
                  <div className="text-sm text-gray-600">
                    ${expenseCategories[0].amount.toFixed(2)} ({expenseCategories[0].percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <h3 className="font-bold text-gray-800 mb-2">Budget Tip</h3>
              <p className="text-sm text-gray-700">
                {expenseCategories[0].percentage > 40 
                  ? `Consider reducing spending on ${expenseCategories[0].name} - it's taking up a large portion of your budget!`
                  : `Your spending looks well-distributed across categories. Keep it up!`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};