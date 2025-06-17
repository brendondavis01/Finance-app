import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Transaction, BudgetData, SavingsGoal, LearningActivity } from '../types/budget';
import { expenseCategories, incomeCategories } from '../data/budgetData';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { BudgetOverview } from './BudgetOverview';
import { CategoryBreakdown } from './CategoryBreakdown';
import { GoalsTracker } from './GoalsTracker';
import { Dashboard } from './Dashboard';

export const BudgetTracker: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    transactions: [],
    monthlyBudget: 0,
    categories: [...expenseCategories, ...incomeCategories],
    savingsGoals: [],
    learningActivities: []
  });
  
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'overview' | 'transactions' | 'categories' | 'goals'>('dashboard');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setBudgetData({
        ...parsed,
        savingsGoals: parsed.savingsGoals || [],
        learningActivities: parsed.learningActivities || []
      });
    }
  }, []);

  // Save data to localStorage whenever budgetData changes
  useEffect(() => {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
  }, [budgetData]);

  const addLearningActivity = (type: LearningActivity['type'], description: string, points: number = 5) => {
    const activity: LearningActivity = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type,
      description,
      points
    };

    setBudgetData(prev => ({
      ...prev,
      learningActivities: [activity, ...prev.learningActivities],
      lastActiveDate: new Date().toISOString()
    }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    setBudgetData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
    
    addLearningActivity(
      'transaction_added',
      `Added ${transaction.type}: ${transaction.description}`,
      transaction.type === 'income' ? 10 : 5
    );
    
    setShowTransactionForm(false);
  };

  const deleteTransaction = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const updateMonthlyBudget = (budget: number) => {
    const isFirstTime = budgetData.monthlyBudget === 0;
    
    setBudgetData(prev => ({
      ...prev,
      monthlyBudget: budget
    }));

    if (isFirstTime && budget > 0) {
      addLearningActivity('budget_set', `Set monthly budget to $${budget.toFixed(2)}`, 15);
    }
  };

  const addGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal]
    }));

    addLearningActivity('goal_created', `Created goal: ${goalData.title}`, 20);
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    }));

    if (updates.completed) {
      const goal = budgetData.savingsGoals.find(g => g.id === id);
      if (goal) {
        addLearningActivity('goal_created', `Completed goal: ${goal.title}! 🎉`, 50);
      }
    }
  };

  const deleteGoal = (id: string) => {
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter(goal => goal.id !== id)
    }));
  };

  const addToGoal = (goalId: string, amount: number) => {
    setBudgetData(prev => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map(goal =>
        goal.id === goalId 
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    }));

    const goal = budgetData.savingsGoals.find(g => g.id === goalId);
    if (goal) {
      addLearningActivity('goal_created', `Added $${amount.toFixed(2)} to ${goal.title}`, 10);
    }
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = budgetData.transactions.filter(
    t => t.date.startsWith(currentMonth)
  );

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBudget = monthlyIncome - monthlyExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Budget Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Take control of your finances
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month's Income</p>
                <p className="text-2xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month's Expenses</p>
                <p className="text-2xl font-bold text-red-600">${monthlyExpenses.toFixed(2)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${remainingBudget.toFixed(2)}
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100">
            <div className="flex gap-1">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'overview', label: 'Overview' },
                { id: 'transactions', label: 'Transactions' },
                { id: 'categories', label: 'Categories' },
                { id: 'goals', label: 'Goals' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <Dashboard
              budgetData={budgetData}
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpenses}
            />
          )}
          
          {activeTab === 'overview' && (
            <BudgetOverview
              budgetData={budgetData}
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpenses}
              onUpdateBudget={updateMonthlyBudget}
            />
          )}
          
          {activeTab === 'transactions' && (
            <TransactionList
              transactions={budgetData.transactions}
              categories={budgetData.categories}
              onDeleteTransaction={deleteTransaction}
            />
          )}
          
          {activeTab === 'categories' && (
            <CategoryBreakdown
              transactions={monthlyTransactions}
              categories={budgetData.categories}
            />
          )}
          
          {activeTab === 'goals' && (
            <GoalsTracker
              goals={budgetData.savingsGoals}
              onAddGoal={addGoal}
              onUpdateGoal={updateGoal}
              onDeleteGoal={deleteGoal}
              onAddToGoal={addToGoal}
            />
          )}
        </div>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <TransactionForm
            onSubmit={addTransaction}
            onClose={() => setShowTransactionForm(false)}
            categories={budgetData.categories}
          />
        )}
      </div>
    </div>
  );
};