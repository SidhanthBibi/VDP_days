import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/clubsphereGradient.png';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SignUpPage = () => {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      
      // Initiate Google OAuth sign-up
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // After successful signup, create profile
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              user_type: userType,
            }
          ]);

        if (profileError) throw profileError;

        // Redirect based on user type
        navigate(userType === 'student' ? '/events' : '/clubs');
      }
    } catch (error) {
      console.error('Error during sign up:', error.message);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="flex justify-center mb-8"
          >
            <img 
              src={Logo} 
              alt="ClubSphere Logo" 
              className="w-16 h-16"
            />
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Join ClubSphere
            </h2>
            <p className="text-gray-300">Select your role to get started</p>
          </motion.div>

          {/* User Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <button
              onClick={() => setUserType('student')}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                userType === 'student'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent'
                : 'border-gray-600 hover:border-blue-400'
              }`}
            >
              <h3 className="text-lg font-semibold mb-1">Student</h3>
              <p className="text-sm text-gray-400">Join clubs and events</p>
            </button>

            <button
              onClick={() => setUserType('incharge')}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                userType === 'incharge'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent'
                : 'border-gray-600 hover:border-blue-400'
              }`}
            >
              <h3 className="text-lg font-semibold mb-1">Club Incharge</h3>
              <p className="text-sm text-gray-400">Manage your club</p>
            </button>
          </motion.div>

          {/* Google Sign Up Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!userType || isLoading}
            onClick={handleGoogleSignUp}
            className={`w-full bg-gray-700/50 backdrop-blur-xl border border-gray-600 rounded-lg px-6 py-3 flex items-center justify-center space-x-3 transition-all duration-300 ${
              userType && !isLoading
              ? 'hover:bg-gray-700/70 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-white font-medium">
              {isLoading ? 'Signing up...' : 'Sign up with Google'}
            </span>
          </motion.button>

          {/* Back to Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 mb-4">Already have an account?</p>
            <button 
              onClick={() => navigate('/login')}
              className="group text-white flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
              <span>Back to Login</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;