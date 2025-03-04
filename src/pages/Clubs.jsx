import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClubCard from "../components/ClubCard";
import { supabase } from '../lib/supabaseClient';

const Clubs = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase.from('Clubs').select('*');
        
        if (selectedCategory) {
          query = query.eq('dept', selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;

        // Fetch events for each club to get accurate event counts
        const clubsWithEventCounts = await Promise.all(data.map(async (club) => {
          // Query the Events table to count events for this club
          const { data: eventsData, error: eventsError } = await supabase
            .from('Events')
            .select('id')
            .eq('club_name', club.name);
            
          if (eventsError) {
            console.error(`Error fetching events for club ${club.name}:`, eventsError);
            return {
              ...club,
              eventCount: 0
            };
          }
          
          // Return the club with its event count
          return {
            ...club,
            eventCount: eventsData ? eventsData.length : 0
          };
        }));
        
        // Transform data to match the expected format
        const transformedClubs = clubsWithEventCounts.map(club => ({
          id: club.id,
          name: club.name || '',
          category: club.dept || 'Other', // Using department as category
          memberCount: club.member || 0,
          followers: club.followers || 0,
          achievements: club.achievements || 'No achievements yet',
          description: club.description || 'No description available',
          image: club.image || null,
          stats: {
            events: club.eventCount.toString(), // Use the actual event count
            members: club.member?.toString() || "0",
            followers: club.followers?.toString() || "0"
          }
        }));
        
        setClubs(transformedClubs);
        
        // Extract unique categories (departments)
        const uniqueCategories = [...new Set(data.map(club => club.dept).filter(Boolean))];
        setCategories(uniqueCategories);
        
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClubs();
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };
  
  const handleCreateClub = () => {
    navigate('/clubDetailform ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error Loading Clubs</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8">
        {/* Background effects with responsive positioning */}
        <div className="fixed top-20 right-4 sm:right-20 w-32 sm:w-64 h-32 sm:h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="fixed bottom-20 left-4 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Our Clubs
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
            Join our diverse community of passionate individuals
          </p>

          {/* Category filters with better spacing on mobile */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            {categories.map((category, index) => (
              <span
                key={index}
                className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-full 
                  ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} 
                  cursor-pointer transition-all duration-300`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </span>
            ))}
          </div>
          
          
        </div>

        {clubs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">No clubs found</h3>
            {selectedCategory ? (
              <p className="text-gray-400">
                No clubs found in the {selectedCategory} category. Try selecting a different category or create a new club.
              </p>
            ) : (
              <p className="text-gray-400">
                There are no clubs registered yet. Be the first to create one!
              </p>
            )}
          </div>
        ) : (
          /* Card grid with improved responsive layout */
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {clubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Clubs;