import { BudgetCategory } from '../types/budget';

export const expenseCategories: BudgetCategory[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍕', color: 'from-orange-400 to-red-500' },
  { id: 'fun', name: 'Entertainment', icon: '🎮', color: 'from-purple-400 to-pink-500' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'from-blue-400 to-indigo-500' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: 'from-green-400 to-teal-500' },
  { id: 'education', name: 'Education', icon: '📚', color: 'from-yellow-400 to-orange-500' },
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: 'from-pink-400 to-rose-500' },
  { id: 'subscriptions', name: 'Subscriptions', icon: '📱', color: 'from-indigo-400 to-purple-500' },
  { id: 'other', name: 'Other', icon: '💰', color: 'from-gray-400 to-gray-600' }
];

export const incomeCategories: BudgetCategory[] = [
  { id: 'allowance', name: 'Allowance', icon: '💵', color: 'from-green-400 to-emerald-500' },
  { id: 'job', name: 'Part-time Job', icon: '💼', color: 'from-blue-400 to-cyan-500' },
  { id: 'chores', name: 'Chores', icon: '🧹', color: 'from-yellow-400 to-amber-500' },
  { id: 'gifts', name: 'Gifts', icon: '🎁', color: 'from-pink-400 to-rose-500' },
  { id: 'side-hustle', name: 'Side Hustle', icon: '🚀', color: 'from-purple-400 to-violet-500' },
  { id: 'other-income', name: 'Other Income', icon: '💎', color: 'from-teal-400 to-cyan-500' }
];

export const goalCategories = [
  { id: 'tech', name: 'Technology', icon: '📱', color: 'from-blue-400 to-indigo-500' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'from-green-400 to-teal-500' },
  { id: 'education', name: 'Education', icon: '🎓', color: 'from-purple-400 to-violet-500' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: 'from-pink-400 to-rose-500' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: 'from-cyan-400 to-blue-500' },
  { id: 'fashion', name: 'Fashion', icon: '👕', color: 'from-orange-400 to-red-500' },
  { id: 'emergency', name: 'Emergency Fund', icon: '🛡️', color: 'from-red-400 to-pink-500' },
  { id: 'other', name: 'Other', icon: '🎯', color: 'from-gray-400 to-gray-600' }
];