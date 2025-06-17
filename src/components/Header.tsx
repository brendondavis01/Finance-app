import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';

export const Header = () => {
  const { isSignedIn, user } = useUser();

  // Check if Clerk is properly configured
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!clerkKey || clerkKey === 'pk_test_placeholder') {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            FinanceLearn
          </h1>
          <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
            Demo Mode - Authentication Disabled
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          FinanceLearn
        </h1>
        
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          ) : (
            <SignInButton>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};