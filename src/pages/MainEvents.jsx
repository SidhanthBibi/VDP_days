import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Check if device is mobile
const isMobile = () => window.innerWidth < 768;

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

const MainEventCard = React.memo(({ event, onCardClick }) => {
  const isMobileView = isMobile();
  
  // Format event date for display
  const eventDate = formatDate(event.date || event.start_date);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={isMobileView ? {} : { scale: 1.02 }}
      className="relative group cursor-pointer aspect-[3/4] w-full"
      onClick={() => onCardClick(event.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 rounded-xl z-10" />
      
      <img
        src={event.poster || "/placeholder.svg"}
        alt={event.event_name}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white">{event.event_name}</h3>
        
        <div className="flex items-center text-gray-300 mt-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{eventDate}</span>
        </div>
        
        <div className="flex items-center text-gray-300 mt-1">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <span className="text-blue-400">{event.club_name}</span>
          <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-sm">
            {typeof event.subevents_count !== 'undefined' ? event.subevents_count : '0'} Sub-events
          </span>
        </div>
      </div>
    </motion.div>
  );
});

const MainEventsPage = () => {
  const navigate = useNavigate();
  
  // Add responsive state
  const [isMobileView, setIsMobileView] = useState(isMobile);
  
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [mainEvents, setMainEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [visiblePastEvents, setVisiblePastEvents] = useState(6);
  
  // New state variables for access control
  const [hasAccessToAnyClub, setHasAccessToAnyClub] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  // Handle resize events for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check user authentication and get email
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user?.email) {
        setCurrentUserEmail(session.user.email);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        if (session?.user?.email) {
          setCurrentUserEmail(session.user.email);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Check if user has access to any club
  useEffect(() => {
    const checkClubAccess = async () => {
      if (!currentUserEmail) return;

      try {
        // Check if user is a coordinator for any club
        const { data: coordinatorData, error: coordinatorError } = await supabase
          .from("Clubs")
          .select("id")
          .eq("Club_Coordinator", currentUserEmail);

        if (coordinatorError) throw coordinatorError;

        if (coordinatorData && coordinatorData.length > 0) {
          setHasAccessToAnyClub(true);
          return;
        }

        // Check if user is in the access array of any club
        const { data: accessData, error: accessError } = await supabase
          .from("Clubs")
          .select("id, access");

        if (accessError) throw accessError;

        // Check each club's access array
        const hasAccess = accessData.some(club => 
          Array.isArray(club.access) && club.access.includes(currentUserEmail)
        );

        setHasAccessToAnyClub(hasAccess);
      } catch (err) {
        console.error("Error checking club access:", err);
      }
    };

    if (currentUserEmail) {
      checkClubAccess();
    }
  }, [currentUserEmail]);

  // Fetch main events data
  useEffect(() => {
    const fetchMainEvents = async () => {
      try {
        // Simple fetch without relationship (for now)
        const { data: eventsData, error: supabaseError } = await supabase
          .from("MainEvents")
          .select("*")
          .order('start_date', { ascending: true });

        if (supabaseError) throw supabaseError;
        
        // Fetch sub-events counts separately
        for (let i = 0; i < eventsData.length; i++) {
          const { data: countData, error: countError } = await supabase
            .from("SubEvents")
            .select("id", { count: "exact" })
            .eq("main_event_id", eventsData[i].id);
            
          if (!countError) {
            eventsData[i].subevents_count = countData.length;
          } else {
            console.error("Error fetching sub-events count:", countError);
            eventsData[i].subevents_count = 0;
          }
        }
        
        const now = new Date();
        const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const today = indiaTime.toISOString().split('T')[0];
        
        // Separate past and upcoming events
        const past = [];
        const upcoming = [];
        
        eventsData.forEach(event => {
          let eventDate = event.start_date;
          
          try {
            const dateParts = eventDate.split('-');
            
            if (dateParts.length === 3 && dateParts[0].length === 2 && dateParts[2].length === 4) {
              eventDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
            
            const eventDateObj = new Date(eventDate);
            const todayDateObj = new Date(today);
            
            eventDateObj.setHours(0, 0, 0, 0);
            todayDateObj.setHours(0, 0, 0, 0);
            
            if (eventDateObj < todayDateObj) {
              past.push(event);
            } else {
              upcoming.push(event);
            }
          } catch (e) {
            // Default to upcoming if date parsing fails
            upcoming.push(event);
          }
        });
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
        setMainEvents(eventsData);
      } catch (err) {
        console.error("Error fetching main events:", err);
        setError(err.message);
        toast.error("Failed to load main events: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMainEvents();
  }, []);

  // Callbacks
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCardClick = useCallback((eventId) => {
    // Navigate to the SubEvents page when a card is clicked
    navigate(`/events/${eventId}/subevents`);
  }, [navigate]);

  // Toggle past events visibility
  const togglePastEvents = useCallback(() => {
    setShowPastEvents(!showPastEvents);
    // Reset visible past events count when toggling
    if (!showPastEvents) {
      setVisiblePastEvents(6);
    }
  }, [showPastEvents]);

  // Filter events based on search query - memoized
  const filterEvents = useCallback((events) => {
    return events.filter((event) => {
      const searchLower = searchQuery.toLowerCase().trim();
      if (!searchLower) return true;

      return (
        event.event_name?.toLowerCase().includes(searchLower) ||
        event.club_name?.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery]);

  // Memoize filtered events to prevent unnecessary re-renders
  const filteredUpcomingEvents = useMemo(() => 
    filterEvents(upcomingEvents),
    [filterEvents, upcomingEvents]
  );
  
  const filteredPastEvents = useMemo(() => 
    filterEvents(pastEvents),
    [filterEvents, pastEvents]
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white px-4 py-8"
    >
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {/* Background Gradients - simplified for mobile */}
      {!isMobileView && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              transition: { duration: 8 }
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              transition: { duration: 8 }
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"
          />
        </>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-16 relative">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Main Events
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Explore major events with multiple activities
          </p>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm
              border border-gray-700/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Upcoming Main Events
        </h2>

        {filteredUpcomingEvents.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No upcoming main events found
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {filteredUpcomingEvents.map((event) => (
            <MainEventCard
              key={event.id}
              event={event}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* Past Events Section - Only load if there are past events */}
      {pastEvents.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div 
            className="flex items-center justify-between cursor-pointer mb-8"
            onClick={togglePastEvents}
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
              Past Main Events
            </h2>
            <div
              className="bg-gray-800 p-2 rounded-full"
            >
              {showPastEvents ? (
                <ChevronUp className="w-6 h-6 text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {showPastEvents && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative overflow-hidden"
              >
                {filteredPastEvents.length === 0 && (
                  <p className="text-center text-gray-400 py-10 col-span-3">
                    No past main events found matching your search
                  </p>
                )}
                
                {/* Show limited number of past events initially */}
                {filteredPastEvents.slice(0, isMobileView ? visiblePastEvents : filteredPastEvents.length).map((event) => (
                  <MainEventCard
                    key={event.id}
                    event={event}
                    onCardClick={handleCardClick}
                  />
                ))}
                
                {/* Load more button for mobile */}
                {isMobileView && filteredPastEvents.length > visiblePastEvents && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg text-gray-300 mt-4 transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Increase the number of visible past events
                      setVisiblePastEvents(prev => Math.min(prev + 6, filteredPastEvents.length));
                    }}
                  >
                    Load More Events ({Math.min(visiblePastEvents, filteredPastEvents.length)} of {filteredPastEvents.length})
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Create New Main Event Button - Only show if user has access to any club */}
      {hasAccessToAnyClub && (
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full 
                shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
            onClick={() => navigate('/create-main-event')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default MainEventsPage;