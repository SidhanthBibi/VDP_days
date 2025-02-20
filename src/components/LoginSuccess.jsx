import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Logo from '../assets/clubsphereGradient.png';
import { CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginSuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        // Get the session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !session.user) {
          throw new Error('Authentication failed. Please try again.');
        }
        
        // Fetch user profile to get user type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Profile not found - user may need to sign up
            throw new Error('Account not found. Please sign up first.');
          }
          throw profileError;
        }
        
        // Wait a moment to show success animation
        setTimeout(() => {
          setIsProcessing(false);
          // Redirect after 1.5 seconds based on user type
          setTimeout(() => {
            if (profileData?.user_type) {
              navigate(profileData.user_type === 'student' ? '/events' : '/clubs');
            } else {
              // If for some reason user_type is missing, redirect to signup
              toast.error('Account setup incomplete. Please complete signup.');
              navigate('/signup');
            }
          }, 1500);
        }, 1000);
        
      } catch (error) {
        console.error('Error completing sign in:', error.message);
        setError(error.message);
        setIsProcessing(false);
      }
    };

    completeSignIn();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 w-full max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="flex justify-center mb-8"
          >
            <img src={Logo} alt="ClubSphere Logo" className="w-16 h-16" />
          </motion.div>

          {isProcessing ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <motion.div 
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Signing You In
              </h2>
              <p className="text-gray-300">Preparing your ClubSphere experience...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-400">
                Sign In Failed
              </h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 border border-blue-500 rounded-xl text-blue-400 font-medium hover:bg-blue-500/10 transition-all duration-300"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle size={64} className="text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Welcome Back!
              </h2>
              <p className="text-gray-300 mb-2">You've signed in successfully.</p>
              <p className="text-gray-400 text-sm">Redirecting you to your dashboard...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginSuccess;