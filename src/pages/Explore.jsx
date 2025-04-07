import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, Users, 
  ChevronRight
} from 'lucide-react';

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    // Reset loading state whenever the location changes
    setIsLoaded(false);
    
    // Use requestAnimationFrame to ensure DOM updates before setting loaded state
    const timer = requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  const handleSectionClick = (type) => {
    navigate(`/${type}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden relative">
      {/* Floating Animated Backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[200%] h-[200%] bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-slow-spin opacity-30 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-l from-pink-600/10 to-cyan-600/10 animate-slow-spin-reverse opacity-30 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Discover Your Community
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Explore the vibrant world of events and clubs tailored just for you
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Events Section */}
          <div 
            className={`transform transition-all duration-700 ${
              isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            } ${activeSection === 'events' ? 'scale-105' : ''}`}
            onMouseEnter={() => setActiveSection('events')}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer 
                         group hover:border-purple-500/50 transition-all duration-300 
                         relative overflow-hidden"
              onClick={() => handleSectionClick('events')}
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                              pointer-events-none" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Calendar className="w-10 h-10 text-purple-400 group-hover:text-white transition-colors" />
                  <h2 className="text-3xl font-bold group-hover:text-white">Events</h2>
                </div>
                
                <p className="text-gray-400 mb-4 group-hover:text-white/80 transition-colors">
                  Discover exciting gatherings, workshops, and opportunities to connect.
                </p>
                
                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                  <span className="mr-2">Explore Events</span>
                  <ChevronRight className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Clubs Section */}
          <div 
            className={`transform transition-all duration-700 delay-300 ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            } ${activeSection === 'clubs' ? 'scale-105' : ''}`}
            onMouseEnter={() => setActiveSection('clubs')}
            onMouseLeave={() => setActiveSection(null)}
          >
            <div 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 cursor-pointer 
                         group hover:border-pink-500/50 transition-all duration-300 
                         relative overflow-hidden"
              onClick={() => handleSectionClick('clubs')}
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-red-600/20 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                              pointer-events-none" />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="w-10 h-10 text-pink-400 group-hover:text-white transition-colors" />
                  <h2 className="text-3xl font-bold group-hover:text-white">Clubs</h2>
                </div>
                
                <p className="text-gray-400 mb-4 group-hover:text-white/80 transition-colors">
                  Join passionate communities and find your tribe of like-minded individuals.
                </p>
                
                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                  <span className="mr-2">Browse Clubs</span>
                  <ChevronRight className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }

        .animate-slow-spin-reverse {
          animation: slow-spin 25s linear infinite reverse;
        }
      `}</style>
    </main>
  );
};

export default Explore;