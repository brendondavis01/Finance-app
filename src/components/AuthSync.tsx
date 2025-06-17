import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabase-client';

export const AuthSync = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncSession = async () => {
      if (isSignedIn) {
        try {
          // Get the JWT token from Clerk
          const token = await getToken({ template: 'supabase' });
          
          if (token) {
            // Set the session in Supabase
            const { error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: '',
            });
            
            if (error) {
              console.error('Error syncing session with Supabase:', error);
            }
          }
        } catch (error) {
          console.error('Error getting token from Clerk:', error);
        }
      } else {
        // Sign out from Supabase when user is not signed in
        await supabase.auth.signOut();
      }
    };

    syncSession();
  }, [isSignedIn, getToken]);

  return null; // This component doesn't render anything
};