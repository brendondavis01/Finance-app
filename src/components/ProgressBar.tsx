import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
      <div 
        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>Step {currentStep}</span>
        <span>{totalSteps} steps total</span>
      </div>
    </div>
  );
};