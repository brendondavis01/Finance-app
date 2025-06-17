import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Award, 
  Flame,
  DollarSign,
  PieChart,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { BudgetData, SavingsGoal, LearningActivity } from '../types/budget';

interface DashboardProps {
  budgetData: BudgetData;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  budgetData,
  monthlyIncome,
  monthlyExpenses
}) => {
  // Calculate learning streak
  const calculateLearningStreak = () => {
    if (!budgetData.learningActivities.length) return 0;
    
    const today = new Date();
    const activities = budgetData.learningActivities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    let currentDate = new Date(today);
    
    // Check if there's activity today or yesterday (to account for different time zones)
    const hasRecentActivity = activities.some(activity => {
      const activityDate = new Date(activity.date);
      const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 1;
    });
    
    if (!hasRecentActivity) return 0;
    
    // Count consecutive days with activities
    for (let i = 0; i < 30; i++) { // Check last 30 days max
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasActivity = activities.some(activity => 
        activity.date.startsWith(dateStr)
      );
      
      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Get active goals summary
  const activeGoals = budgetData.savingsGoals.filter(goal => !goal.completed);
  const completedGoals = budgetData.savingsGoals.filter(goal => goal.completed);
  
  const totalGoalProgress = activeGoals.length > 0 
    ? activeGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / activeGoals.length * 100
    : 0;

  // Get recent activities
  const recentActivities = budgetData.learningActivities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate savings rate
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
  
  // Get upcoming goal deadlines
  const upcomingDeadlines = activeGoals
    .filter(goal => goal.deadline)
    .map(goal => ({
      ...goal,
      daysLeft: Math.ceil((new Date(goal.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }))
    .filter(goal => goal.daysLeft >= 0 && goal.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  const learningStreak = calculateLearningStreak();
  const totalPoints = budgetData.learningActivities.reduce((sum, activity) => sum + activity.points, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Financial Dashboard
        </h1>
        <p className="text-xl text-gray-600">Your complete financial overview</p>
      </div>

      {/* Key Metrics Row */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Monthly Income */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Month's Income</p>
              <p className="text-2xl font-bold text-green-600">${monthlyIncome.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Month's Expenses</p>
              <p className="text-2xl font-bold text-red-600">${monthlyExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-r from-red-400 to-red-500 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
              <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {savingsRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Learning Streak</p>
              <p className="text-2xl font-bold text-orange-600">{learningStreak} days</p>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-xl">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Goals Progress & Learning Stats */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Goals Overview */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Goals Progress</h2>
          </div>

          <div className="space-y-6">
            {/* Goals Summary */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{activeGoals.length}</div>
                <div className="text-sm text-gray-600">Active Goals</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{totalGoalProgress.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>

            {/* Top Goals */}
            {activeGoals.length > 0 ? (
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Top Goals</h3>
                <div className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                      <div key={goal.id} className="flex items-center gap-3">
                        <span className="text-lg">{goal.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-800 text-sm">{goal.title}</span>
                            <span className="text-sm text-gray-600">{progress.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No active goals yet</p>
                <p className="text-sm text-gray-500">Create your first savings goal!</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning & Activity */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Learning Progress</h2>
          </div>

          <div className="space-y-6">
            {/* Learning Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{learningStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Recent Activities</h3>
              {recentActivities.length > 0 ? (
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'quiz' ? 'bg-purple-500' :
                        activity.type === 'goal_created' ? 'bg-blue-500' :
                        activity.type === 'transaction_added' ? 'bg-green-500' :
                        'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{activity.description}</div>
                        <div className="text-xs text-gray-600">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-purple-600">+{activity.points}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent activities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Deadlines</h2>
          </div>

          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-4">
              {upcomingDeadlines.map((goal) => (
                <div key={goal.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{goal.title}</div>
                    <div className="text-sm text-gray-600">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className={`text-right ${
                    goal.daysLeft <= 7 ? 'text-red-600' :
                    goal.daysLeft <= 14 ? 'text-orange-600' :
                    'text-blue-600'
                  }`}>
                    <div className="font-bold">{goal.daysLeft}</div>
                    <div className="text-xs">days left</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">No upcoming deadlines</p>
              <p className="text-sm text-gray-500">You're on track with your goals!</p>
            </div>
          )}
        </div>

        {/* Financial Health Score */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Financial Health</h2>
          </div>

          <div className="space-y-6">
            {/* Health Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                savingsRate >= 20 ? 'text-green-600' :
                savingsRate >= 10 ? 'text-yellow-600' :
                savingsRate >= 0 ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {savingsRate >= 20 ? 'A' :
                 savingsRate >= 10 ? 'B' :
                 savingsRate >= 0 ? 'C' :
                 'D'}
              </div>
              <p className="text-gray-600 mb-4">
                {savingsRate >= 20 ? 'Excellent financial health! 🌟' :
                 savingsRate >= 10 ? 'Good progress! Keep it up! 👍' :
                 savingsRate >= 0 ? 'Room for improvement 💪' :
                 'Time to review your spending 🤔'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Budget</span>
                <span className="font-bold">
                  {budgetData.monthlyBudget > 0 ? `$${budgetData.monthlyBudget.toFixed(2)}` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transactions This Month</span>
                <span className="font-bold">{budgetData.transactions.filter(t => 
                  t.date.startsWith(new Date().toISOString().slice(0, 7))
                ).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Goals</span>
                <span className="font-bold">{activeGoals.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};