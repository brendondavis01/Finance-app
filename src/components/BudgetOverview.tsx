import React, { useState } from 'react';
import { PieChart, TrendingUp, TrendingDown, Target, Edit3 } from 'lucide-react';
import { BudgetData } from '../types/budget';

interface BudgetOverviewProps {
  budgetData: BudgetData;
  monthlyIncome: number;
  monthlyExpenses: number;
  onUpdateBudget: (budget: number) => void;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budgetData,
  monthlyIncome,
  monthlyExpenses,
  onUpdateBudget
}) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budgetData.monthlyBudget.toString());

  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  const budgetUsed = budgetData.monthlyBudget > 0 ? (monthlyExpenses / budgetData.monthlyBudget) * 100 : 0;

  const handleBudgetSave = () => {
    const newBudget = parseFloat(budgetInput) || 0;
    onUpdateBudget(newBudget);
    setIsEditingBudget(false);
  };

  const recentTransactions = budgetData.transactions.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Goal Card */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-500" />
            Monthly Budget Goal
          </h2>
          <button
            onClick={() => setIsEditingBudget(true)}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        {isEditingBudget ? (
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Set your monthly budget"
                />
              </div>
            </div>
            <button
              onClick={handleBudgetSave}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingBudget(false)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {budgetData.monthlyBudget > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-800">
                    ${budgetData.monthlyBudget.toFixed(2)}
                  </span>
                  <span className={`text-lg font-semibold ${
                    budgetUsed <= 100 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {budgetUsed.toFixed(1)}% used
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      budgetUsed <= 75 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      budgetUsed <= 100 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>${monthlyExpenses.toFixed(2)} spent</span>
                  <span>${(budgetData.monthlyBudget - monthlyExpenses).toFixed(2)} remaining</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-gray-600 mb-4">Set a monthly budget to track your spending!</p>
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  Set Budget Goal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Financial Health Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Savings Rate */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Savings Rate</h3>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              savingsRate >= 20 ? 'text-green-600' :
              savingsRate >= 10 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-gray-600 mb-4">
              {savingsRate >= 20 ? 'Excellent! 🌟' :
               savingsRate >= 10 ? 'Good progress! 👍' :
               savingsRate >= 0 ? 'Keep working on it! 💪' :
               'Time to review spending 🤔'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  savingsRate >= 20 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  savingsRate >= 10 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                  'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Spending Trend */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">This Month</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Income</span>
              <span className="font-bold text-green-600">${monthlyIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-bold text-red-600">${monthlyExpenses.toFixed(2)}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">Net Amount</span>
              <span className={`font-bold text-lg ${
                monthlyIncome - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${(monthlyIncome - monthlyExpenses).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-800">{transaction.description}</div>
                    <div className="text-sm text-gray-600">{transaction.date}</div>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};