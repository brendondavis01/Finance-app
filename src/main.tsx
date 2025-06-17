import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider, CLERK_PUBLISHABLE_KEY } from './clerk-config';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
