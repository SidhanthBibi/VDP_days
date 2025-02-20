import React, { useState } from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import Logo from '../assets/clubsphereGradient.png'

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Initiate Google OAuth sign-in
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/loginsuccess`
        }
      });

      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('Error during sign in:', error.message);
      toast.error('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleHoverStart = () => {
    if (!isLoading) {
      setIsHovered(true);
    }
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
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
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700 p-8 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={Logo} alt="ClubSphere Logo" className="w-16 h-16" />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Welcome to ClubSphere
            </h2>
            <p className="text-gray-300">Sign in to connect with your campus community</p>
          </div>

          {/* Enhanced Google Sign In Button with OAuth */}
          <div className="relative mb-6">
            <button
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              onMouseEnter={handleHoverStart}
              onMouseLeave={handleHoverEnd}
              className={`
                w-full rounded-xl border border-gray-600/50 px-6 py-4 
                flex items-center justify-center relative z-10 
                transition-all duration-200 ease-in-out
                ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-[1.02]'}
                ${isHovered && !isLoading ? 'shadow-lg' : 'shadow-md'}
                bg-gradient-to-r from-blue-500/5 via-green-500/5 to-yellow-500/5
              `}
            >
              {/* Button content container */}
              <div className="flex items-center justify-center space-x-4">
                {/* Google logo or loader */}
                <div className="relative flex-shrink-0">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  ) : (
                    <div className="w-5 h-5">
                      <svg 
                        viewBox="0 0 24 24" 
                        className={`w-5 h-5 transition-transform duration-500
                          ${isHovered ? 'transform rotate-[360deg]' : 'rotate-0'}
                        `}
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
                    </div>
                  )}
                </div>

                {/* Button text */}
                <span className={`
                  text-white font-medium transition-opacity duration-200
                  ${isLoading ? 'opacity-70' : 'opacity-100'}
                `}>
                  {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </span>

                {/* Right arrow */}
                <div className={`
                  absolute right-6 transform transition-all duration-200
                  ${isHovered && !isLoading ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}
                `}>
                  <LogIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </button>

            {/* Border glow effect */}
            <div className={`
              absolute -inset-0.5 rounded-xl blur-sm opacity-0 transition-opacity duration-200
              bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500
              ${isHovered && !isLoading ? 'opacity-20' : ''}
            `} />
          </div>

          {/* Sign Up Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">Don't have an account?</p>
            <button 
              onClick={() => window.location.href = '/signup'}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]"
            >
              Create Account
              <ArrowRight className="inline ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;