import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle } from 'lucide-react';
import { quizQuestions } from '../data/quizData';

interface QuizStepProps {
  onNext: (score: number) => void;
  onBack: () => void;
}

export const QuizStep: React.FC<QuizStepProps> = ({ onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === question.correctAnswer) {
      setScore(score + question.points);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (isLastQuestion) {
        const finalScore = selectedAnswer === question.correctAnswer 
          ? score + question.points 
          : score;
        onNext(finalScore);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1500);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Knowledge Check</h2>
        <p className="text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                showResult
                  ? index === question.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : selectedAnswer === index && index !== question.correctAnswer
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                  : selectedAnswer === index
                  ? 'border-purple-500 bg-purple-50 text-purple-800'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {showResult && (
                  <div>
                    {index === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? `Correct! +${question.points} points` : 'Not quite right, but great try!'}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            disabled={showResult}
            className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || showResult}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};