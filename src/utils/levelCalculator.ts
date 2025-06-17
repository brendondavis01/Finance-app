import { OnboardingData } from '../types/onboarding';

export const calculateLevel = (score: number, age: number): OnboardingData['level'] => {
  // Adjust scoring based on age - younger users get slightly more lenient scoring
  const ageAdjustment = age < 16 ? 5 : age < 18 ? 3 : 0;
  const adjustedScore = score + ageAdjustment;

  if (adjustedScore >= 60) {
    return 'Finance Pro';
  } else if (adjustedScore >= 40) {
    return 'Smart Spender';
  } else if (adjustedScore >= 20) {
    return 'Growing Saver';
  } else {
    return 'Emerging Learner';
  }
};