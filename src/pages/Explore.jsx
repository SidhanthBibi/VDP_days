import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, Calendar, Zap, 
  Activity, Book, Music, 
  Code, Palette, Brain,
  ChevronRight
} from 'lucide-react';

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  useEffect(() => {
    // Reset loading state whenever the location changes
    setIsLoaded(false);
    
    // Use requestAnimationFrame to ensure DOM updates before setting loaded state
    const timer = requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  const sections = {
    events: [
      { 
        title: "Tech Talks", 
        icon: <Code className="w-8 h-8" />,
        color: "from-blue-500 to-cyan-400"
      },
      { 
        title: "Cultural Festivals", 
        icon: <Music className="w-8 h-8" />,
        color: "from-purple-500 to-pink-400"
      },
      { 
        title: "Academic Workshops", 
        icon: <Book className="w-8 h-8" />,
        color: "from-green-500 to-emerald-400"
      }
    ],
    clubs: [
      { 
        title: "Tech Clubs", 
        icon: <Activity className="w-8 h-8" />,
        color: "from-blue-600 to-indigo-400"
      },
      { 
        title: "Arts & Design", 
        icon: <Palette className="w-8 h-8" />,
        color: "from-rose-500 to-pink-400"
      },
      { 
        title: "Research Groups", 
        icon: <Brain className="w-8 h-8" />,
        color: "from-amber-500 to-yellow-400"
      }
    ]
  };

  const handleSectionClick = (type) => {
    if (type === 'events') {
      navigate('/events');
    } else {
      navigate('/clubs');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Initial loading animation */}
      <div className={`fixed inset-0 bg-gray-900 z-50 transition-transform duration-1000 ${
        isLoaded ? 'translate-y-full' : 'translate-y-0'
      }`} />

      {/* Background effects */}
      <div className="fixed inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Explore Your Path
          </h1>
          <p className="text-xl text-gray-400">
            Discover events and clubs that match your interests
          </p>
        </div>

        {/* Mind map sections */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Events Section */}
          <div 
            className={`transition-all duration-700 delay-300 transform ${
              isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
            }`}
            onMouseEnter={() => setHoveredSection('events')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div 
              className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 cursor-pointer
                transition-all duration-300 ${hoveredSection === 'events' ? 'scale-105' : ''}`}
              onClick={() => handleSectionClick('events')}
            >
              <div className="flex items-center gap-4 mb-6">
                <Calendar className="w-10 h-10 text-purple-400" />
                <h2 className="text-3xl font-bold">Events</h2>
              </div>
              
              <div className="space-y-4">
                {sections.events.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${item.color} 
                      opacity-0 animate-fade-up`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.title}</span>
                    <ChevronRight className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clubs Section */}
          <div 
            className={`transition-all duration-700 delay-500 transform ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
            }`}
            onMouseEnter={() => setHoveredSection('clubs')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div 
              className={`relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 cursor-pointer
                transition-all duration-300 ${hoveredSection === 'clubs' ? 'scale-105' : ''}`}
              onClick={() => handleSectionClick('clubs')}
            >
              <div className="flex items-center gap-4 mb-6">
                <Users className="w-10 h-10 text-blue-400" />
                <h2 className="text-3xl font-bold">Clubs</h2>
              </div>
              
              <div className="space-y-4">
                {sections.clubs.map((item, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${item.color}
                      opacity-0 animate-fade-up`}
                    style={{ animationDelay: `${(index + 3) * 200}ms` }}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.title}</span>
                    <ChevronRight className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-up {
          animation: fade-up 0.6s forwards;
        }
      `}</style>
    </main>
  );
};

export default Explore;