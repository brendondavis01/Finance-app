import React from 'react';

export const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          FinanceLearn
        </h1>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">
          Demo Mode
        </div>
      </div>
    </div>
  );
};