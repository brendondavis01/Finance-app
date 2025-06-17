import { ClerkProvider } from '@clerk/clerk-react';

// Get the Clerk publishable key from environment variables or use a fallback
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

// For development, we'll use a placeholder that won't cause the app to crash
if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder') {
  console.warn('Clerk publishable key not configured. Authentication features will be disabled.');
}

export { ClerkProvider, CLERK_PUBLISHABLE_KEY };