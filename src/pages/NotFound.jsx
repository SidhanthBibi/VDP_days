import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  // Animation variants remain the same
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const numberVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Top-right gradient blob */}
        <motion.div 
          className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Bottom-left gradient blob */}
        <motion.div 
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Additional background elements */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-72 h-72 bg-pink-600 rounded-full blur-3xl opacity-10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      {[...Array(30)].map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 bg-white/10 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}

      {/* Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-gray-900/50" />

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative text-center z-10"
      >
        {/* 404 Numbers */}
        <motion.div className="flex justify-center mb-8 space-x-4">
          {[4, 0, 4].map((number, index) => (
            <motion.div
              key={index}
              variants={numberVariants}
              className="text-8xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            >
              {number}
            </motion.div>
          ))}
        </motion.div>

        {/* Error Message */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl font-semibold text-gray-200 mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-300 mb-8 max-w-md mx-auto"
        >
          Oops! It seems you've ventured into uncharted territory. 
          The page you're looking for might have moved or doesn't exist.
        </motion.p>

        {/* Navigation Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-gray-800/50 text-gray-300 rounded-full 
              backdrop-blur-xl border border-gray-700/50 hover:text-white hover:border-gray-600 
              transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
              text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
              shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.4)]"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-gray-500 text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <motion.div 
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          Error Code: 404 | Page Not Found
          <motion.div 
            className="w-2 h-2 bg-blue-500 rounded-full"
            animate={{ 
              scale: [1.5, 1, 1.5],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;