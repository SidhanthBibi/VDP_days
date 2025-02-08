import React, { useState } from 'react';
import { Users, Trophy, Calendar, Target } from 'lucide-react';

const Clubs = () => {
  const [activeCard, setActiveCard] = useState(null);

  const clubs = [
    {
      id: 1,
      name: "Tech Society",
      category: "Technology",
      members: 120,
      achievements: "15+ Hackathons Organized",
      description: "A community of tech enthusiasts exploring cutting-edge technologies through workshops, hackathons, and collaborative projects.",
      image: "/api/placeholder/360/640",
      stats: {
        events: "25+",
        projects: "40+",
        competitions: "10+"
      }
    },
    {
      id: 2,
      name: "Design Club",
      category: "Arts & Design",
      members: 85,
      achievements: "Best Club Award 2024",
      description: "Bringing together creative minds to explore various aspects of design including UI/UX, graphic design, and product design.",
      image: "/api/placeholder/360/640",
      stats: {
        events: "20+",
        projects: "35+",
        competitions: "8+"
      }
    },
    {
      id: 3,
      name: "Entrepreneurship Society",
      category: "Business",
      members: 150,
      achievements: "5 Successful Startups",
      description: "Fostering entrepreneurial spirit through mentorship, networking events, and startup incubation programs.",
      image: "/api/placeholder/360/640",
      stats: {
        events: "30+",
        projects: "25+",
        competitions: "12+"
      }
    },
    {
      id: 4,
      name: "Cultural Club",
      category: "Culture",
      members: 200,
      achievements: "Annual Festival Winner",
      description: "Celebrating diversity through cultural events, performances, and international food festivals.",
      image: "/api/placeholder/360/640",
      stats: {
        events: "40+",
        projects: "15+",
        competitions: "6+"
      }
    },
    {
      id: 5,
      name: "Science Club",
      category: "Science",
      members: 95,
      achievements: "National Science Fair Winners",
      description: "Exploring scientific discoveries through experiments, research projects, and interactive demonstrations.",
      image: "/api/placeholder/360/640",
      stats: {
        events: "22+",
        projects: "30+",
        competitions: "15+"
      }
    },
    {
      id: 6,
      name: "Photography Club",
      category: "Arts",
      members: 75,
      achievements: "City-wide Exhibition",
      description: "Capturing moments and sharing stories through the lens, organizing photography walks and exhibitions.",
      image: "/api/placeholder/360/640",
      stats: {
        events: "18+",
        projects: "45+",
        competitions: "7+"
      }
    }
  ];

  const categories = [...new Set(clubs.map(club => club.category))];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Neon Circle Accents */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Our Clubs
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Join our diverse community of passionate individuals
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer transition-all duration-300"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <div
            key={club.id}
            className="relative group cursor-pointer aspect-[3/4]"
            onClick={() => setActiveCard(activeCard === club.id ? null : club.id)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 rounded-xl z-10"></div>
            <img
              src={club.image}
              alt={club.name}
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Glassmorphic Card Content */}
            <div className={`absolute inset-0 backdrop-blur-md bg-gray-900/50 rounded-xl p-6 transition-all duration-300
              ${activeCard === club.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              border border-gray-700/50 z-20`}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{club.name}</h3>
                  <p className="text-blue-400 mb-2">{club.category}</p>
                  <p className="text-gray-300 mb-6">{club.description}</p>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{club.members} Members</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>{club.achievements}</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{club.stats.events}</div>
                      <div className="text-sm text-gray-400">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{club.stats.projects}</div>
                      <div className="text-sm text-gray-400">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{club.stats.competitions}</div>
                      <div className="text-sm text-gray-400">Competitions</div>
                    </div>
                  </div>
                </div>

                <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[20px] 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]">
                  Join Club
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;