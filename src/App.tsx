import React, { useState } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { WelcomeStep } from './components/WelcomeStep';
import { AgeStep } from './components/AgeStep';
import { GoalsStep } from './components/GoalsStep';
import { QuizStep } from './components/QuizStep';
import { ResultsStep } from './components/ResultsStep';
import { BudgetTracker } from './components/BudgetTracker';
import { Header } from './components/Header';
import { AuthSync } from './components/AuthSync';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnboardingData } from './types/onboarding';
import { calculateLevel } from './utils/levelCalculator';

type Step = 'welcome' | 'age' | 'goals' | 'quiz' | 'results';
type AppMode = 'onboarding' | 'budget';

function App() {
  const [appMode, setAppMode] = useState<AppMode>('onboarding');
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});

  const steps: Step[] = ['welcome', 'age', 'goals', 'quiz', 'results'];
  const currentStepIndex = steps.indexOf(currentStep);
  const totalSteps = steps.length - 1; // Don't count welcome step

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleAgeSubmit = (age: number) => {
    setOnboardingData(prev => ({ ...prev, age }));
    handleNext();
  };

  const handleGoalsSubmit = (goals: string[]) => {
    setOnboardingData(prev => ({ ...prev, goals }));
    handleNext();
  };

  const handleQuizComplete = (knowledgeScore: number) => {
    const level = calculateLevel(knowledgeScore, onboardingData.age || 16);
    const finalData: OnboardingData = {
      age: onboardingData.age!,
      goals: onboardingData.goals!,
      knowledgeScore,
      level
    };
    setOnboardingData(finalData);
    handleNext();
  };

  const handleRestart = () => {
    setOnboardingData({});
    setCurrentStep('welcome');
  };

  const handleStartLearning = () => {
    setAppMode('budget');
  };

  const handleBackToOnboarding = () => {
    setAppMode('onboarding');
  };

  if (appMode === 'budget') {
    return (
      <ProtectedRoute>
        <div>
          <Header />
          <BudgetTracker />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <AuthSync />
      <Header />
      <div className="container mx-auto px-4 py-8">
        {currentStep !== 'welcome' && currentStep !== 'results' && (
          <ProgressBar 
            currentStep={currentStepIndex} 
            totalSteps={totalSteps} 
          />
        )}

        <div className="transition-all duration-500 ease-in-out">
          {currentStep === 'welcome' && (
            <WelcomeStep onNext={handleNext} />
          )}
          
          {currentStep === 'age' && (
            <AgeStep onNext={handleAgeSubmit} onBack={handleBack} />
          )}
          
          {currentStep === 'goals' && (
            <GoalsStep onNext={handleGoalsSubmit} onBack={handleBack} />
          )}
          
          {currentStep === 'quiz' && (
            <QuizStep onNext={handleQuizComplete} onBack={handleBack} />
          )}
          
          {currentStep === 'results' && (
            <ResultsStep 
              data={onboardingData as OnboardingData} 
              onRestart={handleRestart}
              onStartLearning={handleStartLearning}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;