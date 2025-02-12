import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import { Calendar, Users, Clock, MapPin, CircleDollarSign } from 'lucide-react';

const LoadingAndErrorWrapper = ({ loading, error, children }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return children;
};

const LandingPage = () => {
  const location = useLocation();
  
  // Group all state declarations together at the top
  const [activeCard, setActiveCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData, error: supabaseError } = await supabase
          .from('Events')
          .select('*');

        if (supabaseError) throw supabaseError;

        setData(eventsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Session storage and loading effect
  useEffect(() => {
    setIsLoaded(false);

    // Restore search query
    const savedSearchQuery = sessionStorage.getItem('eventSearchQuery');
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }

    // Restore active card
    const savedActiveCard = sessionStorage.getItem('eventActiveCard');
    if (savedActiveCard) {
      setActiveCard(parseInt(savedActiveCard, 10));
    }

    // Smooth loading transition
    const timer = requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  // Callbacks
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    sessionStorage.setItem('eventSearchQuery', query);
  }, []);

  const handleCardClick = useCallback((cardId) => {
    const newActiveCard = activeCard === cardId ? null : cardId;
    setActiveCard(newActiveCard);

    if (newActiveCard !== null) {
      sessionStorage.setItem('eventActiveCard', newActiveCard.toString());
    } else {
      sessionStorage.removeItem('eventActiveCard');
    }
  }, [activeCard]);

  // Helper functions
  const monthMap = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12',
    jan: '01', feb: '02', mar: '03', apr: '04', jun: '06', jul: '07', aug: '08', 
    sep: '09', oct: '10', nov: '11', dec: '12'
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    const lowerDate = dateStr.toLowerCase().trim();

    // Check if it's just a month name
    if (monthMap[lowerDate]) return monthMap[lowerDate];

    // Parse the full date
    const parts = lowerDate.split(' ');
    if (parts.length >= 2) {
      const month = parts[0];
      return monthMap[month] || lowerDate;
    }
    return lowerDate;
  };

  // Filter events
  const filteredEvents = data.filter(event => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;

    return (
      event.event_name?.toLowerCase().includes(searchLower) ||
      event.club_name?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower) ||
      normalizeDate(event.date) === normalizeDate(searchQuery)
    );
  });

  return (
    <LoadingAndErrorWrapper loading={loading} error={error}>
      <div className={`min-h-screen bg-gray-900 text-white px-4 py-8 transition-all duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
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
            <input
              id="search-bar"
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="relative group cursor-pointer aspect-[3/4] w-full"
              onClick={() => handleCardClick(event.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 rounded-xl z-10"></div>
              <img
                src={event.poster}
                alt={event.event_name}
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Glassmorphic Card Content */}
              <div className={`absolute inset-0 backdrop-blur-md bg-gray-900/50 rounded-xl p-6 transition-all duration-300
                ${activeCard === event.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                border border-gray-700/50 z-20`}
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{event.event_name}</h3>
                    <p className="text-blue-400 mb-4">{event.club_name}</p>
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
                      <div className="flex items-center text-gray-300">
                        <CircleDollarSign className="w-4 h-4 mr-2" />
                        <span>{event.price}</span>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[20px] 
                    hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                    shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]">
                    <a href={event.register_link}>Register Now</a>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoadingAndErrorWrapper>
  );
};

export default LandingPage;