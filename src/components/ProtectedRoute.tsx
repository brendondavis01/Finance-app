import { useAuth } from '@clerk/clerk-react';
import { SignIn } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Check if Clerk is properly configured
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey || clerkKey === 'pk_test_placeholder') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h2>
          <p className="text-gray-600 mb-4">
            This app requires Clerk authentication to be configured. Please set up your Clerk publishable key.
          </p>
          <div className="bg-gray-100 p-4 rounded text-left text-sm">
            <p className="font-semibold mb-2">To fix this:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Create a Clerk account at clerk.com</li>
              <li>Get your publishable key</li>
              <li>Add VITE_CLERK_PUBLISHABLE_KEY to your environment variables</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Sign in to continue
          </h2>
          <SignIn />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};