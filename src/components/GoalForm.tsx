import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { SavingsGoal } from '../types/budget';
import { goalCategories } from '../data/budgetData';

interface GoalFormProps {
  goal?: SavingsGoal | null;
  onSubmit: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ goal, onSubmit, onClose }) => {
  const [title, setTitle] = useState(goal?.title || '');
  const [targetAmount, setTargetAmount] = useState(goal?.targetAmount?.toString() || '');
  const [category, setCategory] = useState(goal?.category || '');
  const [icon, setIcon] = useState(goal?.icon || '🎯');
  const [deadline, setDeadline] = useState(goal?.deadline || '');
  const [customIcon, setCustomIcon] = useState('');

  const popularIcons = ['📱', '🚗', '🎮', '👕', '✈️', '🎓', '💻', '🏠', '💍', '🎸', '📷', '⌚'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAmount || !category) return;
    
    const selectedCategory = goalCategories.find(cat => cat.id === category);
    
    onSubmit({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: goal?.currentAmount || 0,
      category,
      icon: customIcon || icon,
      color: selectedCategory?.color || 'from-gray-400 to-gray-600',
      deadline: deadline || undefined,
      completed: goal?.completed || false
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
                <Target className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {goal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="e.g., Save for iPhone 15"
                required
              />
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
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
              <div className="grid grid-cols-2 gap-2">
                {goalCategories.map((cat) => (
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

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose an Icon
              </label>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {popularIcons.map((iconOption) => (
                  <button
                    key={iconOption}
                    type="button"
                    onClick={() => {
                      setIcon(iconOption);
                      setCustomIcon('');
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-center text-2xl ${
                      icon === iconOption && !customIcon
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {iconOption}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Or type your own emoji..."
                  maxLength={2}
                />
              </div>
            </div>

            {/* Deadline (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Preview */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <h3 className="font-medium text-gray-700 mb-2">Preview:</h3>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <span className="text-2xl">{customIcon || icon}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-800">{title || 'Your Goal'}</div>
                  <div className="text-sm text-gray-600">
                    Target: ${targetAmount || '0.00'}
                    {deadline && ` by ${new Date(deadline).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!title || !targetAmount || !category}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};