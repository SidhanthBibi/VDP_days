import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SignUpSuccess = ({ onAnimationComplete }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setShowSuccess(true);
    
    const timer = setTimeout(() => {
      setShowOptions(true);
      onAnimationComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900">
      {/* Main success animation container */}
      <div className={`transform transition-all duration-700 ${showOptions ? '-translate-y-12' : 'translate-y-0'}`}>
        <div className="relative">
          {/* Expanding circle background */}
          <div className={`absolute inset-0 rounded-full bg-green-500/20 transition-all duration-700 
            ${showSuccess ? 'scale-[3] opacity-0' : 'scale-0 opacity-100'}`} 
          />
          
          {/* Pulsing rings */}
          <div className={`absolute inset-0 rounded-full border-4 border-green-500 
            ${showSuccess ? 'animate-success-ping' : ''}`} 
          />
          <div className={`absolute inset-0 rounded-full border-4 border-green-500 delay-75
            ${showSuccess ? 'animate-success-ping' : ''}`} 
          />
          
          {/* Main circle with checkmark */}
          <div className={`relative w-20 h-20 rounded-full bg-green-500 
            flex items-center justify-center transform transition-all duration-500
            ${showSuccess ? 'scale-100' : 'scale-0'}`}>
            <svg
              className={`w-12 h-12 text-white transform transition-transform duration-500 
                ${showSuccess ? 'scale-100' : 'scale-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
                className="animate-success-draw"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Success message and login button */}
      <div className={`mt-8 text-center transform transition-all duration-500 
        ${showOptions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-bold text-white mb-6">
          Account Created Successfully!
        </h2>
        
        <Link to="/login">
          <button className="w-64 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg 
            shadow-lg hover:bg-green-600 hover:shadow-xl transform transition-all duration-300
            hover:-translate-y-0.5 active:translate-y-0">
            Continue to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SignUpSuccess;