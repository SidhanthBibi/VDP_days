// src/context/ClubContext.jsx
import { createContext, useContext } from 'react';
import Arrow from '../assets/ArrowDev.jpg'
import NIC from '../assets/NIC.jpg'
const ClubContext = createContext();

export const ClubProvider = ({ children }) => {
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
      longDescription: "Arrow Dev is a vibrant community dedicated to fostering innovation and technical excellence. We organize regular workshops, hackathons, and collaborative projects that allow members to gain hands-on experience with cutting-edge technologies.",
      meetingTimes: "Every Tuesday, 5:00 PM - 7:00 PM",
      location: "Tech Building, Room 205",
      contactEmail: "arrowdev@example.com",
      upcomingEvents: [
        {
          title: "Web3 Workshop",
          date: "March 15, 2025",
          location: "Tech Hub, Room 301"
        },
        {
          title: "Spring Hackathon",
          date: "April 5-6, 2025",
          location: "Innovation Center"
        }
      ],
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
      longDescription: "Next-gen Intelligence is a creative hub where designers and artists come together to push the boundaries of digital and traditional design. Our community focuses on nurturing talent through collaborative projects and innovative workshops.",
      meetingTimes: "Every Wednesday, 4:00 PM - 6:00 PM",
      location: "Design Center, Room 105",
      contactEmail: "nextgen@example.com",
      upcomingEvents: [
        {
          title: "UI/UX Design Workshop",
          date: "March 20, 2025",
          location: "Design Lab, Room 201"
        },
        {
          title: "Digital Art Exhibition",
          date: "April 10, 2025",
          location: "Gallery Space"
        }
      ],
    }
  ];

  return (
    <ClubContext.Provider value={{ clubs }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClubs = () => useContext(ClubContext);