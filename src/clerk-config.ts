import { ClerkProvider } from '@clerk/clerk-react';

// Get the Clerk publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.');
}

export { ClerkProvider, CLERK_PUBLISHABLE_KEY };