import React, { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Users,
  Globe,
  Award,
  Zap,
  Calendar,
  BookOpen,
  ArrowRight,
  Rocket,
  Network,
  MessageCircle,
  ChevronDown,
  Settings,
  Shield,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../index.css";

const Home = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const keyFeatures = [
    {
      icon: <Network className="w-12 h-12 text-blue-400" />,
      title: "Seamless Networking",
      description:
        "Connect with students across different clubs and departments",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-purple-400" />,
      title: "Event Discovery",
      description: "Find and explore campus events tailored to your interests",
    },
    {
      icon: <Rocket className="w-12 h-12 text-blue-500" />,
      title: "Club Management",
      description:
        "Comprehensive tools for club leaders to manage and grow their communities",
    },
  ];

  const engagementFeatures = [
    {
      icon: <Target className="w-16 h-16 text-blue-400" />,
      title: "Goal Tracking",
      description:
        "Set and track club goals, measure success metrics, and celebrate achievements",
      benefits: [
        "Progress visualization",
        "Achievement badges",
        "Performance insights",
      ],
    },
    {
      icon: <Shield className="w-16 h-16 text-purple-400" />,
      title: "Resource Management",
      description:
        "Efficiently manage club resources, budgets, and assets in one place",
      benefits: ["Budget tracking", "Asset inventory", "Resource scheduling"],
    },
    {
      icon: <Settings className="w-16 h-16 text-pink-400" />,
      title: "Automation Tools",
      description:
        "Streamline club operations with powerful automation features",
      benefits: ["Event scheduling", "Member notifications", "Task automation"],
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Animated Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center text-center px-4">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>

        <motion.div
          className="max-w-4xl relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-l to-[#F27735] via-[#6e3591] from-[#084a90]"
            variants={itemVariants}
          >
            Your Campus, Your Community
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-300 mb-12"
            variants={itemVariants}
          >
            ClubSphere : Bridging Passion, Opportunity, and Connection
          </motion.p>

          <motion.div
            className="flex justify-center space-x-6"
            variants={itemVariants}
          >
            <Link to="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-blue-500 flex to-purple-600 text-white px-8 py-4 rounded-full 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]"
              >
                Get Started
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight />
                </motion.span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ y: -2 }}
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-300 hover:text-white flex items-center"
            >
              Learn More
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="ml-2"
              >
                <ChevronDown />
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="py-24 bg-gray-800/30 backdrop-blur-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Key Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)",
                }}
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 
                  transform transition-all duration-300"
              >
                <motion.div
                  className="mb-6"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="py-24"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Enhanced Club Management
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {engagementFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.25)",
                }}
                className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700"
              >
                <motion.div
                  className="mb-6"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center text-gray-400"
                    >
                      <motion.div
                        className="w-2 h-2 bg-blue-400 rounded-full mr-2"
                        whileHover={{ scale: 1.5 }}
                      />
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-24 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Ready to Transform Your Campus Experience?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-12"
          >
            Join UniClub and unlock a world of opportunities, connections, and
            growth.
          </motion.p>

          <Link to="/signup">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full 
                transition-all duration-300 shadow-[0_0_25px_rgba(147,51,234,0.3)]"
            >
              Create Your Account
              <motion.span
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block ml-2"
              >
                <Zap />
              </motion.span>
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
