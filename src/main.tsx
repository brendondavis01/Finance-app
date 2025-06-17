import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider, CLERK_PUBLISHABLE_KEY } from './clerk-config';
import App from './App.tsx';
import './index.css';

// Only wrap with ClerkProvider if Clerk is properly configured
const AppWithAuth = () => {
  const isClerkConfigured = CLERK_PUBLISHABLE_KEY && CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder';
  
  if (isClerkConfigured) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    );
  }
  
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>
);