"use client"
import { useState } from "react"
import ClubCard from "../components/ClubCard"
import ClubDetailPopup from "../components/ClubDetailPopup"
import Arrow from "../assets/ArrowDev.jpg"
import NIC from "../assets/NIC.jpg"

const Clubs = () => {
  const [activeCard, setActiveCard] = useState(null)
  const [selectedClub, setSelectedClub] = useState(null)

  const clubs = [
    {
      id: 1,
      name: "Arrow Dev",
      category: "Technology",
      memberCount: 120,
      followers: 250,
      achievements: "15+ Hackathons Organized",
      description:
        "A community of tech enthusiasts exploring cutting-edge technologies through workshops, hackathons, and collaborative projects.",
      image: Arrow,
      stats: {
        events: "25+",
        projects: "40+",
        competitions: "10+",
      },
    },
    {
      id: 2,
      name: "Next-gen intelligence",
      category: "Arts & Design",
      memberCount: 85,
      followers: 180,
      achievements: "Best Club Award 2024",
      description:
        "Bringing together creative minds to explore various aspects of design including UI/UX, graphic design, and product design.",
      image: NIC,
      stats: {
        events: "20+",
        projects: "35+",
        competitions: "8+",
      },
    }
  ]

  const categories = [...new Set(clubs.map((club) => club.category))]

  const handleViewClub = (club) => {
    setSelectedClub(club)
  }

  const handleClosePopup = () => {
    setSelectedClub(null)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Add padding-top to account for navbar height */}
      <div className="pt-24 px-4 pb-8">
        <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Our Clubs
          </h1>
          <p className="text-xl text-gray-400 mb-8">Join our diverse community of passionate individuals</p>

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

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              onViewClub={() => handleViewClub(club)}
            />
          ))}
        </div>

        {selectedClub && <ClubDetailPopup club={selectedClub} onClose={handleClosePopup} />}
      </div>
    </main>
  )
}

export default Clubs