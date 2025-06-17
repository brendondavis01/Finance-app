import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AgeStepProps {
  onNext: (age: number) => void;
  onBack: () => void;
}

export const AgeStep: React.FC<AgeStepProps> = ({ onNext, onBack }) => {
  const [age, setAge] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    
    if (!age || ageNum < 13 || ageNum > 25) {
      setError('Please enter an age between 13 and 25');
      return;
    }
    
    setError('');
    onNext(ageNum);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">How old are you?</h2>
        <p className="text-gray-600">This helps us personalize your experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            className="w-full p-4 text-2xl text-center border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            min="13"
            max="25"
          />
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
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
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};