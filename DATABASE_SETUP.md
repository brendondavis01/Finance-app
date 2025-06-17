# Database Setup Instructions

This guide will help you set up the Supabase database with the transactions table and Row Level Security (RLS) policies for user budgeting.

## Prerequisites

1. A Supabase project (you already have one at `https://iwdinufisnvxtlvygqht.supabase.co`)
2. Access to your Supabase dashboard

## Step 1: Run the SQL Schema

1. Go to your Supabase dashboard
2. Navigate to the **SQL Editor** section
3. Copy the contents of `supabase-schema.sql` and paste it into the SQL editor
4. Click **Run** to execute the SQL

This will create:
- `transactions` table with RLS policies
- `categories` table with default categories
- `budget_goals` table with RLS policies
- `transaction_summary` view
- Necessary indexes and triggers

## Step 2: Configure Clerk JWT Template

1. Go to your Clerk dashboard
2. Navigate to **JWT Templates**
3. Create a new template named `supabase`
4. Use the following configuration:

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

## Step 3: Configure Supabase JWT Settings

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your JWT secret
3. Go to **Settings** > **Auth** > **JWT Settings**
4. Set the JWT expiry to match your Clerk settings (default: 3600 seconds)
5. Configure the JWT secret to work with Clerk tokens

## Step 4: Update Environment Variables

Update your `src/clerk-config.ts` file with your actual Clerk publishable key:

```typescript
const CLERK_PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
```

## Step 5: Test the Setup

1. Start your development server
2. Sign in with Clerk
3. Try adding a transaction
4. Verify that the transaction is saved to your Supabase database

## Database Schema Overview

### Tables

1. **transactions**
   - `id`: UUID primary key
   - `user_id`: UUID (automatically set by RLS)
   - `description`: Transaction description
   - `amount`: Decimal amount
   - `category`: Category name
   - `transaction_type`: 'income' or 'expense'
   - `date`: Transaction date
   - `created_at`, `updated_at`: Timestamps

2. **categories**
   - Pre-populated with common income and expense categories
   - Includes icons and colors for UI display

3. **budget_goals**
   - Allows users to set monthly spending limits per category
   - Enforced by RLS policies

### RLS Policies

- Users can only access their own data
- All CRUD operations are protected
- Automatic `user_id` assignment on insert

### Views

- **transaction_summary**: Monthly summaries by category and type

## Troubleshooting

### Common Issues

1. **"JWT token is invalid"**
   - Check that your Clerk JWT template is correctly configured
   - Verify the JWT secret in Supabase matches your Clerk settings

2. **"Row level security policy violation"**
   - Ensure the user is properly authenticated
   - Check that the `auth.uid()` function is working correctly

3. **"Table does not exist"**
   - Make sure you've run the SQL schema in your Supabase project
   - Check that you're connected to the correct Supabase project

### Testing RLS

You can test RLS policies by:
1. Creating a transaction while signed in
2. Signing out and trying to access the same transaction
3. Verifying that you can only see your own transactions

## Security Notes

- All user data is automatically isolated by `user_id`
- RLS policies prevent cross-user data access
- JWT tokens are validated on every request
- Database connections use the authenticated user context

## Next Steps

After setting up the database:
1. Test the transaction creation flow
2. Implement budget goal management
3. Add transaction filtering and search
4. Create reporting and analytics features 