import { ClerkProvider } from '@clerk/clerk-react';

// You need to replace this with your actual Clerk publishable key
// Get it from: https://dashboard.clerk.com/
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_YOUR_CLERK_PUBLISHABLE_KEY';

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

export { ClerkProvider, CLERK_PUBLISHABLE_KEY };