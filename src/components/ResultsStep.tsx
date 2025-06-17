import React from 'react';
import { Trophy, Star, Zap, Rocket } from 'lucide-react';
import { OnboardingData } from '../types/onboarding';
import { goalOptions } from '../data/quizData';

interface ResultsStepProps {
  data: OnboardingData;
  onRestart: () => void;
  onStartLearning: () => void;
}

const getLevelInfo = (level: OnboardingData['level']) => {
  switch (level) {
    case 'Emerging Learner':
      return {
        icon: Star,
        color: 'from-yellow-400 to-orange-500',
        description: 'You\'re just starting your financial journey! We\'ll help you build strong fundamentals.',
        recommendations: ['Start with basic budgeting', 'Learn about saving habits', 'Understand needs vs wants']
      };
    case 'Growing Saver':
      return {
        icon: Zap,
        color: 'from-green-400 to-blue-500',
        description: 'You have some good financial habits! Let\'s build on what you know.',
        recommendations: ['Explore different savings strategies', 'Learn about compound interest', 'Set up emergency funds']
      };
    case 'Smart Spender':
      return {
        icon: Trophy,
        color: 'from-blue-500 to-purple-600',
        description: 'You understand money well! Ready for more advanced concepts.',
        recommendations: ['Dive into investing basics', 'Learn about credit and loans', 'Explore side income opportunities']
      };
    case 'Finance Pro':
      return {
        icon: Rocket,
        color: 'from-purple-600 to-pink-600',
        description: 'Impressive! You\'re ready for advanced financial strategies.',
        recommendations: ['Advanced investing techniques', 'Tax optimization strategies', 'Entrepreneurship and business finance']
      };
  }
};

export const ResultsStep: React.FC<ResultsStepProps> = ({ data, onRestart, onStartLearning }) => {
  const levelInfo = getLevelInfo(data.level);
  const Icon = levelInfo.icon;
  
  const selectedGoalLabels = goalOptions
    .filter(goal => data.goals.includes(goal.id))
    .map(goal => goal.label);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <div className={`bg-gradient-to-r ${levelInfo.color} p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Congratulations! 🎉</h2>
        <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${levelInfo.color} text-white font-bold text-2xl mb-4`}>
          {data.level}
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {levelInfo.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Score</h3>
          <div className="text-5xl font-bold text-purple-600 mb-2">{data.knowledgeScore}</div>
          <div className="text-gray-600">out of 70 points</div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${(data.knowledgeScore / 70) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Goals</h3>
          <div className="space-y-2">
            {selectedGoalLabels.slice(0, 3).map((goal, index) => (
              <div key={index} className="text-left py-2 px-4 bg-purple-50 rounded-lg">
                {goal}
              </div>
            ))}
            {selectedGoalLabels.length > 3 && (
              <div className="text-purple-600 font-medium">
                +{selectedGoalLabels.length - 3} more goals
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Recommended Learning Path</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {levelInfo.recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <div className="font-semibold text-gray-800">{rec}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Take Quiz Again
        </button>
        <button
          onClick={onStartLearning}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Start Learning! 🚀
        </button>
      </div>
    </div>
  );
};