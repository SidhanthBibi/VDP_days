import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Logo from '../assets/clubsphereGradient.png';
import { CheckCircle, Loader, XCircle } from 'lucide-react';

const SignUpSuccess = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const completeSignUp = async () => {
      try {
        // Get the session and user type
        const { data: { session } } = await supabase.auth.getSession();
        const userType = sessionStorage.getItem('pendingUserType');
        
        if (!session || !session.user) {
          throw new Error('Authentication failed. Please try again.');
        }
        
        if (!userType) {
          throw new Error('User type not found. Please restart the sign up process.');
        }

        // Store the user email for potential error display
        setUserEmail(session.user.email);
        
        // Check if the email domain is valid for club incharge
        if (userType === 'incharge' && !session.user.email.endsWith('@srmist.edu.in')) {
          // Sign out the user since they don't have the required email domain
          await supabase.auth.signOut();
          throw new Error('Club Incharge registration requires an @srmist.edu.in email address.');
        }

        // Update the user profile with the user type
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: session.user.id,
              email: session.user.email,
              user_type: userType,
              created_at: new Date(),
            },
          ]);

        if (profileError) throw profileError;
        
        // Clear the session storage
        sessionStorage.removeItem('pendingUserType');
        
        // Wait a moment to show success animation
        setTimeout(() => {
          setIsProcessing(false);
          // Redirect after 1.5 seconds - modified to redirect students to edit-profile
          setTimeout(() => {
            navigate(userType === 'student' ? '/edit-profile' : '/clubDetailform');
          }, 1500);
        }, 1000);
      } catch (error) {
        console.error('Error completing sign up:', error.message);
        setError(error.message);
        setIsProcessing(false);
      }
    };

    completeSignUp();
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
                Setting Up Your Account
              </h2>
              <p className="text-gray-300">Almost there! We're configuring your profile...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-center mb-4 text-red-500">
                <XCircle size={64} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-red-400">
                Something Went Wrong
              </h2>
              <p className="text-gray-300 mb-4">{error}</p>
              
              {/* Display the email that was used if the error is about domain requirements */}
              {error.includes('@srmist.edu.in') && userEmail && (
                <div className="bg-gray-700/50 p-3 rounded-lg mb-6 text-sm">
                  <p className="text-gray-300">Attempted signup with: <span className="text-white">{userEmail}</span></p>
                  <p className="mt-2 text-amber-300">Please use an @srmist.edu.in email for Club Incharge registration.</p>
                </div>
              )}
              
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
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
                Welcome to ClubSphere!
              </h2>
              <p className="text-gray-300 mb-2">Your account has been created successfully.</p>
              <p className="text-gray-400 text-sm">Redirecting you to complete your profile...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpSuccess;