import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Calendar, User, UserPlus } from 'lucide-react';

const ClubCard = ({ club, activeCard, setActiveCard }) => {
  const navigate = useNavigate();
  const isActive = activeCard === club.id;

  // Define logo styles based on club category
  const getLogoStyles = (category) => {
    const styles = {
      Technology: 'bg-blue-500',
      'Arts&Design': 'bg-purple-500',
      Business: 'bg-green-500',
      Culture: 'bg-red-500',
      Science: 'bg-yellow-500',
      Arts: 'bg-pink-500',
      Engineering: 'bg-cyan-500',
      Sports: 'bg-orange-500',
      Literature: 'bg-indigo-500',
      Music: 'bg-rose-500'
    };
    return styles[category] || 'bg-gray-500';
  };

  const handleViewClub = () => {
    // Using string interpolation to create the dynamic route
    // This will navigate to /clubDetail/[id] where [id] is the club's ID
    navigate(`/clubDetail/${club.id}`);
  };

  return (
    <article 
      className={`relative w-full bg-gray-800 rounded-[24px] p-2 text-white transition-all duration-300 ${
        isActive ? 'scale-105 shadow-xl' : 'hover:scale-102'
      }`}
      onMouseEnter={() => setActiveCard(club.id)}
      onMouseLeave={() => setActiveCard(null)}
    >
      <section className="bg-gray-700/50 rounded-t-[18px] p-6 text-sm ">
        <div className="absolute -top-[-15px] right-4 h-[70px] w-[70px] flex justify-center items-center">
          <div className={`w-16 h-16 rounded-xl overflow-hidden border-4 border-gray-800 ${getLogoStyles(club.category)} flex items-center justify-center`}>
            {club.image ? (
              <img 
                src={club.image}
                alt={`${club.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {club.name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        <header className="flex justify-between items-center flex-nowrap gap-4">
          <span className={`${getLogoStyles(club.category)}/20 bg-[#213A62] text-[#4F9EF9] px-3 py-1 rounded-full`}>
            {club.category}
          </span>
        </header>
        
        <div className="my-6">
          <h3 className="text-2xl font-bold mb-2">{club.name}</h3>
          <p className="text-gray-400 line-clamp-2">{club.description}</p>
        </div>

        <div className="flex items-center gap-2 text-purple-400">
          <Trophy className="h-4 w-4" />
          <span className="text-sm">{club.achievements}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-gray-400">{club.memberCount} members</span>
        </div>
      </section>
      
      <footer className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-lg font-bold text-blue-400">{club.stats.events}+</p>
            <p className="text-xs text-gray-400">Events</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <User className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-lg font-bold text-green-400">{club.stats.members}+</p>
            <p className="text-xs text-gray-400">Members</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <UserPlus className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-lg font-bold text-yellow-400">{club.stats.followers}+</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
        </div>
        
        <button 
          onClick={handleViewClub}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors duration-300"
        >
          View Club
        </button>
      </footer>
    </article>
  );
};

export default ClubCard;