import React, { useState, useEffect } from 'react';
import { 
  Users, Globe, Award, Zap, Calendar, BookOpen, 
  ArrowRight, Rocket, Network, MessageCircle, 
  ChevronDown, Star 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75; 
        setIsVisible(prev => ({ ...prev, [section.id]: isVisible }));
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Computer Science Student",
      quote: "UniClub transformed my university experience by connecting me with amazing tech communities.",
      avatar: "/api/placeholder/100/100",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Design Club President",
      quote: "Our club's visibility and member engagement skyrocketed after joining UniClub.",
      avatar: "/api/placeholder/100/100",
      rating: 5
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

  const stats = [
    { value: "50+", label: "Active Clubs" },
    { value: "10,000+", label: "Students" },
    { value: "200+", label: "Events Monthly" },
    { value: "95%", label: "Satisfaction" }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen overflow-x-hidden">
      {/* Navigation Progress */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center text-center px-4 animate-on-scroll">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl relative">
          <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-fade-in">
            Your Campus, Your Community
          </h1>
          <p className="text-2xl text-gray-300 mb-12 opacity-0 animate-fade-in-up delay-300">
            UniClub: Bridging Passion, Opportunity, and Connection
          </p>
          
          <div className="flex justify-center space-x-6 opacity-0 animate-fade-in-up delay-700">
            <Link to="/login">
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]">
                Get Started 
                <ArrowRight className="inline ml-2 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-300 hover:text-white flex items-center transition-colors"
            >
              Learn More
              <ChevronDown className="ml-2 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Modified Features Section */}
      <section id="features" className="py-24 bg-gray-800/30 backdrop-blur-xl animate-on-scroll">
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
      <section id="testimonials" className="py-24 animate-on-scroll">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700
                  transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-16 h-16 rounded-full mr-4 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 italic">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 relative animate-on-scroll">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join UniClub and unlock a world of opportunities, connections, and growth.
          </p>
          <Link to="/login">
            <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-full 
              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
              shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]">
              Create Your Account 
              <Zap className="inline ml-2 transform group-hover:rotate-12 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s forwards;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default Home;