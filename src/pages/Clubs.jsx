// Clubs.jsx
import React, { useState } from 'react';
import ClubCard from '../components/ClubCard';

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
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Our Clubs
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Join our diverse community of passionate individuals
        </p>

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

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} activeCard={activeCard} setActiveCard={setActiveCard} />
        ))}
      </div>
    </div>
  );
};

export default Clubs;
