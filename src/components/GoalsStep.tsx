import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { goalOptions } from '../data/quizData';

interface GoalsStepProps {
  onNext: (goals: string[]) => void;
  onBack: () => void;
}

export const GoalsStep: React.FC<GoalsStepProps> = ({ onNext, onBack }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoals.length === 0) return;
    onNext(selectedGoals);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What are your financial goals?</h2>
        <p className="text-gray-600">Select all that apply - we'll help you achieve them!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {goalOptions.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedGoals.includes(goal.id)
                  ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="text-lg font-semibold text-gray-800">
                {goal.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={selectedGoals.length === 0}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue ({selectedGoals.length} selected)
          </button>
        </div>
      </form>
    </div>
  );
};