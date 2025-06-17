import React, { useState } from 'react';
import { Plus, Target, Calendar, Trophy, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { SavingsGoal } from '../types/budget';
import { goalCategories } from '../data/budgetData';
import { GoalForm } from './GoalForm';

interface GoalsTrackerProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteGoal: (id: string) => void;
  onAddToGoal: (goalId: string, amount: number) => void;
}

export const GoalsTracker: React.FC<GoalsTrackerProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAddToGoal
}) => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [addingToGoal, setAddingToGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  const getCategoryInfo = (categoryId: string) => {
    return goalCategories.find(cat => cat.id === categoryId) || goalCategories[goalCategories.length - 1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleAddToGoal = (goalId: string) => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      onAddToGoal(goalId, amount);
      setAddingToGoal(null);
      setAddAmount('');
    }
  };

  const handleCompleteGoal = (goal: SavingsGoal) => {
    onUpdateGoal(goal.id, { 
      completed: true, 
      currentAmount: goal.targetAmount 
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Savings Goals</h2>
        <p className="text-gray-600">Set goals, track progress, and achieve your dreams!</p>
      </div>

      {/* Add Goal Button */}
      <div className="text-center">
        <button
          onClick={() => setShowGoalForm(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Goal
        </button>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Active Goals</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const categoryInfo = getCategoryInfo(goal.category);
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysLeft = getDaysUntilDeadline(goal.deadline);
              
              return (
                <div key={goal.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${categoryInfo.color}`}>
                        <span className="text-2xl">{goal.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{categoryInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-gray-800">
                        ${goal.currentAmount.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600">
                        / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div
                        className={`h-4 rounded-full transition-all duration-500 ${
                          progress >= 100 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                          progress >= 75 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                          progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-purple-400 to-purple-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span>${(goal.targetAmount - goal.currentAmount).toFixed(2)} to go</span>
                    </div>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Target: {formatDate(goal.deadline)}
                      </span>
                      {daysLeft !== null && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          daysLeft < 0 ? 'bg-red-100 text-red-800' :
                          daysLeft <= 7 ? 'bg-orange-100 text-orange-800' :
                          daysLeft <= 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` :
                           daysLeft === 0 ? 'Due today!' :
                           `${daysLeft} days left`}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {progress >= 100 ? (
                      <button
                        onClick={() => handleCompleteGoal(goal)}
                        className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-4 h-4" />
                        Mark Complete!
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setAddingToGoal(goal.id)}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
                        >
                          Add Money
                        </button>
                        {addingToGoal === goal.id && (
                          <div className="flex gap-2 mt-2 w-full">
                            <div className="flex-1">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={addAmount}
                                  onChange={(e) => setAddAmount(e.target.value)}
                                  className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddToGoal(goal.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setAddingToGoal(null)}
                              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Completed Goals
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {completedGoals.map((goal) => {
              const categoryInfo = getCategoryInfo(goal.category);
              
              return (
                <div key={goal.id} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryInfo.color}`}>
                      <span className="text-lg">{goal.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{goal.title}</h4>
                      <p className="text-sm text-gray-600">${goal.targetAmount.toFixed(2)}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No goals yet!</h3>
          <p className="text-gray-600 mb-6">Create your first savings goal and start working towards your dreams.</p>
          <button
            onClick={() => setShowGoalForm(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Goal Form Modal */}
      {(showGoalForm || editingGoal) && (
        <GoalForm
          goal={editingGoal}
          onSubmit={(goalData) => {
            if (editingGoal) {
              onUpdateGoal(editingGoal.id, goalData);
              setEditingGoal(null);
            } else {
              onAddGoal(goalData);
              setShowGoalForm(false);
            }
          }}
          onClose={() => {
            setShowGoalForm(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
};