import React, { useState, useEffect } from 'react';
import { 
  Users, Globe, Award, Zap, Calendar, BookOpen, 
  ArrowRight, Rocket, Network, MessageCircle 
} from 'lucide-react';

const Home2 = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Computer Science Student",
      quote: "UniClub transformed my university experience by connecting me with amazing tech communities.",
      avatar: "/api/placeholder/100/100"
    },
    {
      name: "Emma Thompson",
      role: "Design Club President",
      quote: "Our club's visibility and member engagement skyrocketed after joining UniClub.",
      avatar: "/api/placeholder/100/100"
    }
  ];

  const keyFeatures = [
    {
      icon: <Network className="w-12 h-12 text-blue-400" />,
      title: "Seamless Networking",
      description: "Connect with students across different clubs and departments"
    },
    {
      icon: <BookOpen className="w-12 h-12 text-purple-400" />,
      title: "Event Discovery",
      description: "Find and explore campus events tailored to your interests"
    },
    {
      icon: <Rocket className="w-12 h-12 text-blue-500" />,
      title: "Club Management",
      description: "Comprehensive tools for club leaders to manage and grow their communities"
    }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background Accents */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Your Campus, Your Community
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            UniClub: Bridging Passion, Opportunity, and Connection
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full 
              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
              shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]">
              Get Started <ArrowRight className="inline ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-800/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 
                  transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-800/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join UniClub and unlock a world of opportunities, connections, and growth.
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full 
            hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
            shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]">
            Create Your Account <Zap className="inline ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home2;