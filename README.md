# Teen Financial Literacy App

A comprehensive financial education platform designed specifically for teenagers to learn budgeting, saving, and financial planning through interactive onboarding and hands-on budget tracking.

## Features

### 🎯 Personalized Onboarding
- Age-based customization (13-25 years)
- Goal setting and financial aspirations
- Knowledge assessment quiz
- Personalized learning level assignment

### 💰 Budget Tracker
- Income and expense tracking
- Category-based organization
- Monthly budget goals
- Savings rate calculation
- Financial health scoring

### 🎯 Goals Management
- Savings goal creation and tracking
- Progress visualization
- Deadline management
- Achievement celebrations

### 📊 Analytics & Insights
- Spending breakdown by category
- Monthly financial summaries
- Learning activity tracking
- Progress streaks and gamification

### 🔐 Secure Authentication
- Clerk authentication integration
- Supabase database with Row Level Security
- User data isolation and protection

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. A Clerk account and application
3. A Supabase project

### Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Clerk**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Create a new application
   - Copy your publishable key
   - Update `.env` file with your Clerk key:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
     ```

3. **Configure Supabase**
   - The Supabase configuration is already set up
   - Run the SQL schema in your Supabase project:
     ```sql
     -- Copy and run the contents of supabase-schema.sql in your Supabase SQL editor
     ```

4. **Configure Clerk JWT Template**
   - In Clerk Dashboard, go to JWT Templates
   - Create a new template named `supabase`
   - Use this configuration:
     ```json
     {
       "aud": "authenticated",
       "exp": "{{exp}}",
       "iat": "{{iat}}",
       "iss": "{{iss}}",
       "sub": "{{user.id}}",
       "email": "{{user.primary_email_address.email_address}}",
       "phone": "{{user.primary_phone_number.phone_number}}",
       "app_metadata": {
         "provider": "clerk",
         "providers": ["clerk"]
       },
       "user_metadata": {
         "email": "{{user.primary_email_address.email_address}}",
         "email_verified": "{{user.primary_email_address.verification.status}}",
         "phone_verified": "{{user.primary_phone_number.verification.status}}",
         "sub": "{{user.id}}"
       },
       "role": "authenticated"
     }
     ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # React components
│   ├── onboarding/     # Onboarding flow components
│   ├── budget/         # Budget tracking components
│   └── shared/         # Shared UI components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── data/               # Static data and configurations
```

## Key Components

### Onboarding Flow
- **WelcomeStep**: Introduction and overview
- **AgeStep**: Age collection for personalization
- **GoalsStep**: Financial goal selection
- **QuizStep**: Knowledge assessment
- **ResultsStep**: Personalized level assignment

### Budget Tracker
- **Dashboard**: Overview of financial health
- **TransactionForm**: Add income/expenses
- **CategoryBreakdown**: Spending analysis
- **GoalsTracker**: Savings goal management
- **BudgetOverview**: Monthly budget tracking

### Authentication
- **ProtectedRoute**: Route protection wrapper
- **AuthSync**: Clerk-Supabase session synchronization
- **Header**: Authentication status and controls

## Database Schema

The app uses Supabase with the following main tables:
- `transactions`: User financial transactions
- `categories`: Income/expense categories
- `budget_goals`: User budget targets

All tables implement Row Level Security (RLS) for data protection.

## Learning Levels

The app assigns users to one of four learning levels based on their quiz performance:

1. **Emerging Learner**: Basic financial concepts
2. **Growing Saver**: Intermediate saving strategies
3. **Smart Spender**: Advanced budgeting skills
4. **Finance Pro**: Investment and advanced topics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
1. Check the documentation
2. Review the database setup guide
3. Ensure all environment variables are configured
4. Verify Clerk and Supabase integrations

## Deployment

The app can be deployed to any static hosting service:
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables on your hosting platform
4. Ensure Clerk and Supabase are properly configured for production