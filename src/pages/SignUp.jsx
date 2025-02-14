import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, User, Users } from 'lucide-react';
import { supabase } from '../supabaseClient';
import '../index.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isClub, setIsClub] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    try {
      // Store user type before OAuth redirect
      localStorage.setItem('userType', isClub ? 'club' : 'student');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('OAuth Sign Up Error:', error);
        setErrorMessage('Sign up failed. Please try again.');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
        throw error;
      }
    } catch (error) {
      console.error('Sign Up Catch Block Error:', error.message);
      setErrorMessage('Sign up failed. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
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
                onClick={handleSignUp}
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