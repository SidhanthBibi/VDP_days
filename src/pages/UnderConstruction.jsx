"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wrench, Hammer, HardHat, Cog, Zap, Clock, Mail, Bell, Settings, Code, Palette } from "lucide-react"

const UnderConstruction = () => {
  const [progress, setProgress] = useState(0)
  const [currentTool, setCurrentTool] = useState(0)
  const [sparkles, setSparkles] = useState([])
  const [currentPhase, setCurrentPhase] = useState(0)

  const tools = [
    { icon: Hammer, color: "text-yellow-400", name: "Building" },
    { icon: Wrench, color: "text-blue-400", name: "Configuring" },
    { icon: HardHat, color: "text-orange-400", name: "Planning" },
    { icon: Cog, color: "text-purple-400", name: "Optimizing" },
    { icon: Code, color: "text-green-400", name: "Coding" },
    { icon: Palette, color: "text-pink-400", name: "Designing" },
  ]

  const phases = [
    "Initializing project structure...",
    "Setting up database connections...",
    "Implementing core features...",
    "Designing user interface...",
    "Testing functionality...",
    "Optimizing performance...",
    "Final preparations...",
  ]

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return 15 + Math.random() * 10
        return prev + Math.random() * 2
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  // Tool rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTool((prev) => (prev + 1) % tools.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Phase rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Generate sparkles
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
        size: Math.random() * 2 + 1,
      }))
      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 5000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-6, 6, -6],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const gearVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 12,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  }

  return (
    <div className="bg-[#101720] h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Multiple Gradient Blobs */}
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-blue-500/12 to-purple-600/12 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.2, 0.12],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-orange-500/12 to-yellow-600/12 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.12, 0.2, 0.12],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/8 to-teal-600/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.15, 0.08],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Floating Sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            style={{
              top: `${sparkle.y}%`,
              left: `${sparkle.x}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -60, -120],
              x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Floating Gears */}
      <motion.div className="absolute top-12 left-12" variants={gearVariants} animate="animate">
        <Cog className="w-12 h-12 text-blue-400/15" />
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12"
        variants={gearVariants}
        animate="animate"
        style={{ animationDirection: "reverse" }}
      >
        <Cog className="w-10 h-10 text-purple-400/15" />
      </motion.div>

      <motion.div className="absolute top-1/4 right-1/4" variants={gearVariants} animate="animate">
        <Settings className="w-8 h-8 text-orange-400/15" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/4"
        variants={gearVariants}
        animate="animate"
        style={{ animationDirection: "reverse" }}
      >
        <Settings className="w-6 h-6 text-green-400/15" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative text-center z-10 max-w-5xl mx-auto w-full"
      >
        {/* ClubSphere Logo/Title */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 mb-2"
            style={{
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            ClubSphere
          </motion.h1>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 mx-auto rounded-full"
            animate={{
              scaleX: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Construction Icon with Tool Animation */}
        <motion.div variants={itemVariants} className="mb-4">
          <motion.div variants={floatingVariants} animate="animate" className="relative inline-block">
            <motion.div className="w-20 h-20 bg-gradient-to-br from-orange-400/20 to-yellow-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-orange-400/30 shadow-[0_0_25px_rgba(251,146,60,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTool}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                  className={`${tools[currentTool].color}`}
                >
                  {React.createElement(tools[currentTool].icon, { size: 28 })}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Tool Sparks */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-1 -left-1"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.8, 0.3],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.7,
              }}
            >
              <Zap className="w-3 h-3 text-blue-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Message */}
        <motion.div variants={itemVariants} className="mb-7">
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5"
            animate={{
              textShadow: [
                "0 0 15px rgba(255,255,255,0.4)",
                "0 0 30px rgba(147,51,234,0.4)",
                "0 0 15px rgba(255,255,255,0.4)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Under Construction
          </motion.h2>
          <motion.p
            className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            We're crafting something extraordinary! Our development team is working around the clock to deliver the
            ultimate club management experience.
          </motion.p>
        </motion.div>

        {/* Current Tool Status */}
        <motion.div variants={itemVariants} className="mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTool}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-400 flex items-center justify-center gap-2"
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              Currently {tools[currentTool].name.toLowerCase()}...
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Development Progress</span>
            <motion.span
              className="text-blue-400 text-sm font-bold"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-gray-700/50">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Current Phase */}
        <motion.div variants={itemVariants} className="mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              className="text-gray-300 text-sm font-mono bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 inline-block"
            >
              {phases[currentPhase]}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Features Coming Soon */}
        <motion.div variants={itemVariants} className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-3">What's Coming</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {[
              { icon: Bell, text: "Smart Notifications", desc: "Real-time updates and alerts" },
              { icon: Clock, text: "Event Scheduling", desc: "Advanced calendar management" },
              { icon: Mail, text: "Enhanced Messaging", desc: "Seamless communication tools" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 hover:border-gray-600/50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: index * 0.5,
                  }}
                >
                  <feature.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                </motion.div>
                <h4 className="text-white font-semibold mb-1 text-sm">{feature.text}</h4>
                <p className="text-gray-400 text-xs">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div variants={itemVariants} className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <motion.div
            className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          Building the future of club management
          <motion.div
            className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default UnderConstruction
