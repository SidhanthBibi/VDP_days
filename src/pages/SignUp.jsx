import React, { useState } from 'react';
import { User, Users, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  'https://uzecuccnvrjjrfsftarx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZWN1Y2NudnJqanJmc2Z0YXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzg4MDgsImV4cCI6MjA1NDg1NDgwOH0.p7ucVwNv6umkgNx82fjtrGW1gaybSrNMhojTR2vD2XM'
);

const SignUpPage = () => {
  const [isClub, setIsClub] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const checkUserExists = async (email, userType) => {
    try {
      const { data, error } = await supabase
        .from(userType === 'club' ? 'clubs' : 'students')
        .select('club_email, userEmail')  // Check both possible column names
        .or(`club_email.eq.${email},userEmail.eq.${email}`);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  const saveUserToSupabase = async (userData, userType) => {
    try {
      // Check if user exists first
      const exists = await checkUserExists(userData.email, userType);
      if (exists) {
        throw new Error('Account already exists with this email. Please login instead.');
      }

      let insertData;
      if (userType === 'club') {
        insertData = {
          club_name: userData.name,
          club_email: userData.email,
          club_image: userData.picture,
          google_id: userData.sub,
          created_at: new Date().toISOString()
        };
      } else {
        insertData = {
          name: userData.name,
          email: userData.email,
          profile_picture: userData.picture,
          google_id: userData.sub,
          created_at: new Date().toISOString()
        };
      }

      const { data, error } = await supabase
        .from(userType === 'club' ? 'clubs' : 'students')
        .insert([insertData]);

      if (error) {
        console.error('Supabase insertion error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user data from Google
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userData = await response.json();

        // Try saving to Supabase first
        await saveUserToSupabase(userData, isClub ? 'club' : 'student');

        // If successful, save to localStorage
        localStorage.setItem('Google_Token', tokenResponse.access_token);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userImage', userData.picture);
        localStorage.setItem('userType', isClub ? 'club' : 'student');

        if (!isClub) {
          navigate('/signup_success');
        } else {
          navigate('/clubDetail');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        setErrorMessage(error.message || 'An error occurred during signup');
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    },
    onError: () => {
      setErrorMessage('Login Failed');
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      {/* Error Alert */}
      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
          <div className="mx-4 bg-gray-800 border border-red-500/50 rounded-lg shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <div className="text-red-400 mb-1 font-medium">Error</div>
                <div className="text-sm text-gray-300">{errorMessage}</div>
              </div>
              <button 
                onClick={() => setShowError(false)}
                className="ml-4 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-10 border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>

          <div className="flex items-center justify-center">
            <div className="w-full p-6 rounded-2xl max-w-sm text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 bg-gray-700/50 p-2 rounded-lg">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                        !isClub ? 'bg-blue-600 ring-2 ring-blue-400' : 'hover:bg-gray-600'
                      }`}
                      onClick={() => setIsClub(false)}
                    >
                      <User size={16} />
                      Student
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                        isClub ? 'bg-blue-600 ring-2 ring-blue-400' : 'hover:bg-gray-600'
                      }`}
                      onClick={() => setIsClub(true)}
                    >
                      <Users size={16} />
                      Club
                    </button>
                  </div>
                </div>
                <div className="text-sm text-blue-400 font-medium animate-fade-in">
                  {isClub ? (
                    <div className="flex items-center justify-center gap-2">
                      <Users size={14} />
                      Signing up as a Club
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <User size={14} />
                      Signing up as a Student
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-300 mt-6 mb-6">Sign up with Google to continue</p>
              
              <button
                onClick={() => login()}
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
                  Already have an account?{' '}
                  <Link to="/login" className="text-blue-500 hover:text-blue-400">
                    Login
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

export default SignUpPage;