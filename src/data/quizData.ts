import { QuizQuestion } from '../types/onboarding';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's the best way to start building an emergency fund?",
    options: [
      "Save whatever's left after spending",
      "Set aside a fixed amount each month first",
      "Only save when you get extra money",
      "Wait until you have a job to start saving"
    ],
    correctAnswer: 1,
    points: 10
  },
  {
    id: 2,
    question: "If you want to buy something that costs $200, and you get $50 allowance per month, how should you plan?",
    options: [
      "Ask parents to buy it now",
      "Save $50 for 4 months",
      "Use a credit card",
      "Buy something cheaper instead"
    ],
    correctAnswer: 1,
    points: 15
  },
  {
    id: 3,
    question: "What does 'compound interest' mean?",
    options: [
      "Interest you pay on loans",
      "Interest that grows on both your original money and previous interest earned",
      "Interest that stays the same",
      "Interest you get from your parents"
    ],
    correctAnswer: 1,
    points: 20
  },
  {
    id: 4,
    question: "You have $100. The best way to make it grow is to:",
    options: [
      "Keep it under your mattress",
      "Spend it on things you want",
      "Put it in a savings account or investment",
      "Lend it to friends"
    ],
    correctAnswer: 2,
    points: 15
  },
  {
    id: 5,
    question: "What's a budget?",
    options: [
      "A plan for how you'll spend and save your money",
      "The total amount of money you have",
      "Money your parents give you",
      "A type of bank account"
    ],
    correctAnswer: 0,
    points: 10
  }
];

export const goalOptions = [
  { id: 'save-phone', label: '📱 Save for a new phone', category: 'tech' },
  { id: 'save-car', label: '🚗 Save for a car', category: 'transportation' },
  { id: 'college-fund', label: '🎓 Build college fund', category: 'education' },
  { id: 'emergency-fund', label: '🛡️ Create emergency fund', category: 'security' },
  { id: 'invest-learn', label: '📈 Learn about investing', category: 'growth' },
  { id: 'side-hustle', label: '💼 Start a side business', category: 'entrepreneurship' },
  { id: 'travel-fund', label: '✈️ Save for travel', category: 'experiences' },
  { id: 'gaming-setup', label: '🎮 Buy gaming equipment', category: 'entertainment' }
];