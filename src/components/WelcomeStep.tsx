import React from 'react';
import { Rocket, Target, Brain } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full">
            <Rocket className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome to FinanceLearn!
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Let's discover your financial personality and create a personalized learning path just for you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 my-12">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <Target className="w-10 h-10 text-purple-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">Set Your Goals</h3>
          <p className="text-gray-600 text-sm">Tell us what you want to achieve financially</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <Brain className="w-10 h-10 text-blue-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">Test Your Knowledge</h3>
          <p className="text-gray-600 text-sm">Quick quiz to see what you already know</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <Rocket className="w-10 h-10 text-green-500 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-800 mb-2">Get Your Level</h3>
          <p className="text-gray-600 text-sm">Receive a personalized learning plan</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Let's Get Started! 🚀
      </button>
    </div>
  );
};