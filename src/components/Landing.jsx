import React, { useState } from 'react';
import poster from '../assets/testposter.jpg';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';

const LandingPage = () => {
  const [activeCard, setActiveCard] = useState(null);

  const events = [
    {
      id: 1,
      title: "Tech Workshop 2025",
      club: "Tech Society",
      date: "Feb 15, 2025",
      time: "2:00 PM",
      location: "Innovation Lab",
      description: "Join us for an immersive workshop on AI and Machine Learning. Learn from industry experts and get hands-on experience with cutting-edge technology.",
      image: poster
    },
    {
      id: 2,
      title: "Design Thinking Session",
      club: "Design Club",
      date: "Feb 18, 2025",
      time: "3:30 PM",
      location: "Creative Studio",
      description: "Explore the principles of design thinking and apply them to real-world problems.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      club: "Entrepreneurship Society",
      date: "Feb 20, 2025",
      time: "6:00 PM",
      location: "Main Auditorium",
      description: "Watch innovative startup pitches from student entrepreneurs and network with investors.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 4,
      title: "Cultural Festival",
      club: "Cultural Club",
      date: "Feb 25, 2025",
      time: "11:00 AM",
      location: "Campus Ground",
      description: "Celebrate diversity through music, dance, and food from around the world.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 5,
      title: "Hackathon 2025",
      club: "Coding Club",
      date: "Mar 1, 2025",
      time: "9:00 AM",
      location: "CS Building",
      description: "24-hour coding challenge with amazing prizes and opportunities.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 6,
      title: "Photography Exhibition",
      club: "Photography Club",
      date: "Mar 5, 2025",
      time: "10:00 AM",
      location: "Art Gallery",
      description: "Annual photography exhibition showcasing the best works from our talented members.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 7,
      title: "Debate Championship",
      club: "Debate Society",
      date: "Mar 8, 2025",
      time: "1:00 PM",
      location: "Conference Hall",
      description: "Inter-college debate championship with exciting topics and prizes.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 8,
      title: "Music Concert",
      club: "Music Club",
      date: "Mar 12, 2025",
      time: "5:00 PM",
      location: "Open Air Theatre",
      description: "End of semester musical extravaganza featuring student bands and performances.",
      image: "/api/placeholder/360/640"
    },
    {
      id: 9,
      title: "Science Fair",
      club: "Science Club",
      date: "Mar 15, 2025",
      time: "10:00 AM",
      location: "Science Complex",
      description: "Annual science fair showcasing innovative projects and experiments.",
      image: "/api/placeholder/360/640"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Neon Circle Accent */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 relative">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Campus Events
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover and join amazing events from university clubs
          </p>
        </div>
      </div>

      {/* 3x3 Grid Layout with 9:16 aspect ratio */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {events.map((event) => (
          <div 
            key={event.id}
            className="relative group cursor-pointer aspect-[3/4] w-full"
            onClick={() => setActiveCard(activeCard === event.id ? null : event.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 rounded-xl z-10"></div>
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover rounded-xl"
            />
            
            {/* Glassmorphic Card Content */}
            <div className={`absolute inset-0 backdrop-blur-md bg-gray-900/50 rounded-xl p-6 transition-all duration-300
              ${activeCard === event.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              border border-gray-700/50 z-20`}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                  <p className="text-blue-400 mb-4">{event.club}</p>
                  <p className="text-gray-300 mb-6 line-clamp-4">{event.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                
                <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]">
                  Register Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;