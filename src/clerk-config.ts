import { ClerkProvider } from '@clerk/clerk-react';

// Get the Clerk publishable key from environment variables or use a fallback
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Y29oZXJlbnQtcmFwdG9yLTg4LmNsZXJrLmFjY291bnRzLmRldiQ';

// For development, we'll use a placeholder that won't cause the app to crash
if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === 'pk_test_Y29oZXJlbnQtcmFwdG9yLTg4LmNsZXJrLmFjY291bnRzLmRldiQ') {
  console.warn('Clerk publishable key not configured. Running in demo mode without authentication.');
}

export { ClerkProvider, CLERK_PUBLISHABLE_KEY };