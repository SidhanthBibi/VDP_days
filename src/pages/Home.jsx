import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, Users, Calendar, Zap, Globe, 
  Briefcase, BookOpen, MessageCircle 
} from 'lucide-react';

const Home = () => {
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef([]);

  const features = [
    {
      icon: <Users className="w-12 h-12 text-blue-400" />,
      title: "Community Connect",
      description: "Bridge gaps between students and campus clubs"
    },
    {
      icon: <Calendar className="w-12 h-12 text-purple-400" />,
      title: "Event Discovery",
      description: "Find and join exciting campus events"
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-500" />,
      title: "Instant Networking",
      description: "Connect with like-minded students instantly"
    }
  ];

  const observeSections = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
  };

  useEffect(() => {
    observeSections();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Neon Background Accents */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section 
        id="hero" 
        ref={(el) => sectionRefs.current.push(el)}
        className={`relative min-h-screen flex items-center justify-center text-center transition-all duration-1000 
          ${activeSection === 'hero' ? 'opacity-100' : 'opacity-50 scale-95'}`}
      >
        <div className="max-w-4xl px-4">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Elevate Your Campus Experience
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            UniClub: Where Passion Meets Opportunity
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
      <section 
        id="features"
        ref={(el) => sectionRefs.current.push(el)}
        className={`py-24 relative transition-all duration-1000
          ${activeSection === 'features' ? 'opacity-100' : 'opacity-50 scale-95'}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 
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
    </div>
  );
};

export default Home;