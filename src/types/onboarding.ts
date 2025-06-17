export interface OnboardingData {
  age: number;
  goals: string[];
  knowledgeScore: number;
  level: 'Emerging Learner' | 'Growing Saver' | 'Smart Spender' | 'Finance Pro';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}