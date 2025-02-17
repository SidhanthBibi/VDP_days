import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../index.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to create user in users table if not exists
  const createUserIfNotExists = async (session) => {
    const { user } = session;
    
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      // If user doesn't exist, create a new user
      if (!existingUser) {
        const userType = localStorage.getItem('userType') || 'student';
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            full_name: user.user_metadata.full_name,
            user_type: userType,
            avatar_url: user.user_metadata.avatar_url || '',
            
          })
          .select();

        if (insertError) {
          console.error('Error creating user:', insertError);
          throw insertError;
        }

        // Clear user type after creation
        localStorage.removeItem('userType');

        return newUser[0];
      }

      // Clear user type if user exists
      localStorage.removeItem('userType');

      return existingUser;
    } catch (error) {
      console.error('Error in createUserIfNotExists:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const user = await createUserIfNotExists(session);

          if (!user) {
            setErrorMessage('Failed to create or find user account.');
            setShowError(true);
            await supabase.auth.signOut();
            return;
          }

          // Store user information
          setUser(session.user);
          localStorage.setItem('userName', session.user.user_metadata.full_name);
          localStorage.setItem('userEmail', session.user.email);
          localStorage.setItem('userImage', session.user.user_metadata.avatar_url || '');

          // Navigate to clubs page
          navigate('/clubs');
        } catch (error) {
          console.error('Authentication error:', error);
          setErrorMessage('Login failed. Please try again.');
          setShowError(true);
          await supabase.auth.signOut();
        }
      }
    });

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const user = await createUserIfNotExists(session);

          if (user) {
            setUser(session.user);
            localStorage.setItem('userName', session.user.user_metadata.full_name);
            localStorage.setItem('userEmail', session.user.email);
            localStorage.setItem('userImage', session.user.user_metadata.avatar_url || '');
            navigate('/clubs');
          } else {
            setErrorMessage('Login failed. Please try again.');
            setShowError(true);
          }
        } catch (error) {
          console.error('Session verification error:', error);
          setErrorMessage('Login failed. Please try again.');
          setShowError(true);
        }
      }
      setLoading(false);
    });

    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'online',
            prompt: 'consent',
          },
          redirectTo: import.meta.env.VITE_REDIRECT_URL || window.location.origin + '/clubs'
        }
      });
      
      if (error) {
        setErrorMessage('Login failed. Please try again.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        throw error;
      }
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage('Login failed. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
        </div>
      )}

      <div className="w-full max-w-md relative">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-10 border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back!</h2>

          <div className="flex items-center justify-center">
            <div className="w-full p-6 rounded-2xl max-w-sm text-center">
              <p className="text-gray-300 mb-6">Login with Google to continue</p>
              
              <button
                onClick={handleSignIn}
                className="w-full px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg 
                         flex items-center justify-center gap-3 hover:bg-gray-100 
                         transition-all duration-300 border border-gray-300 shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-500 hover:text-blue-400">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;