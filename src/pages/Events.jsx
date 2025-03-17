import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  CircleDollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Check if device is mobile
const isMobile = () => window.innerWidth < 768;

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Define simpler animation variants for mobile
const getAnimationVariants = (isMobileView) => ({
  backgroundGradient: isMobileView 
    ? { scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1], transition: { duration: 10 }}
    : { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], transition: { duration: 8 }},
  fadeIn: { opacity: [0, 1], transition: { duration: 0.3 }},
  cardHover: isMobileView ? {} : { scale: 1.02 },
});

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

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return "";
  
  try {
    // Handle different time formats
    let timeParts;
    if (timeString.includes(':')) {
      timeParts = timeString.split(':');
    } else {
      return timeString;
    }
    
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (e) {
    return timeString;
  }
};

const EventCard = React.memo(({ event, isActive, onCardClick, handleRegisterClick, isPastEvent }) => {
  const isMobileView = isMobile();
  
  // Format event date and time for display
  const eventStartDate = formatDate(event.start_date);
  const eventStartTime = formatTime(event.start_time);
  const eventEndDate = formatDate(event.end_date);
  const eventEndTime = formatTime(event.end_time);
  
  // Create display strings for date/time
  const dateDisplay = eventStartDate === eventEndDate 
    ? eventStartDate 
    : `${eventStartDate} - ${eventEndDate}`;
    
  const timeDisplay = eventStartTime === eventEndTime 
    ? eventStartTime 
    : `${eventStartTime} - ${eventEndTime}`;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={isMobileView ? {} : { scale: 1.02 }}
      className={`relative group cursor-pointer aspect-[3/4] w-full ${isPastEvent ? "grayscale hover:grayscale-0 transition-all duration-300" : ""}`}
      onClick={() => onCardClick(event.id)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 rounded-xl z-10" />
      {isPastEvent && (
        <div className="absolute top-4 right-4 bg-black/70 text-red-400 px-3 py-1 rounded-full text-sm z-20">
          Past Event
        </div>
      )}
      <img
        src={event.poster}
        alt={event.event_name}
        className="w-full h-full object-cover rounded-xl"
        loading="lazy"
      />

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute inset-0 ${isMobileView ? "bg-gray-900/70" : "backdrop-blur-md bg-gray-900/50"} rounded-xl p-6
              border border-gray-700/50 z-20`}
          >
            <div className="h-full flex flex-col justify-between">
              <div>
                <motion.h3
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  {event.event_name}
                </motion.h3>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-blue-400 mb-4"
                >
                  {event.club_name}
                </motion.p>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-gray-300 mb-6 line-clamp-4"
                >
                  {event.description}
                </motion.p>

                <div className="space-y-3">
                  {/* Date Display */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="flex items-center text-gray-300"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{dateDisplay}</span>
                  </motion.div>
                  
                  {/* Time Display */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="flex items-center text-gray-300"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{timeDisplay}</span>
                  </motion.div>
                  
                  {/* Location Display */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="flex items-center text-gray-300"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </motion.div>
                  
                  {/* Price Display */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="flex items-center text-gray-300"
                  >
                    <CircleDollarSign className="w-4 h-4 mr-2" />
                    <span>{event.price}</span>
                  </motion.div>
                </div>
              </div>
              
              {!isPastEvent ? (
                <div className="flex justify-center gap-5">
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 bg-white text-black px-6 py-3 rounded-[10px] w-1/2
                        transition-all duration-300
                        shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  >
                    <a href={event.websiteLink}>Visit</a>
                  </motion.button>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[10px] 
                        transition-all duration-300 w-1/2
                        shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    onClick={(e) => handleRegisterClick(e, event.register_link)}
                  >
                    Register
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-gray-700 text-white px-6 py-3 rounded-[10px] w-full
                      transition-all duration-300"
                >
                  <a href={event.websiteLink}>View Details</a>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Add responsive state
  const [isMobileView, setIsMobileView] = useState(isMobile);
  
  // Animation variants based on device
  const animationVariants = useMemo(() => getAnimationVariants(isMobileView), [isMobileView]);

  // State declarations
  const [activeCard, setActiveCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [visiblePastEvents, setVisiblePastEvents] = useState(6); // Number of past events initially visible

  // Handle resize events for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fetch data and separate past and upcoming events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData, error: supabaseError } = await supabase
          .from("Events")
          .select("*")
          .order('start_date', { ascending: true }); // Updated to use start_date

        if (supabaseError) throw supabaseError;
        
        const now = new Date();
        const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const today = indiaTime.toISOString().split('T')[0];
        
        // Separate past and upcoming events
        const past = [];
        const upcoming = [];
        
        eventsData.forEach(event => {
          // Use start_date instead of date
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
        setData(eventsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        toast.error("Failed to load events: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Session storage and loading effect
  useEffect(() => {
    setIsLoaded(false);
    const savedSearchQuery = sessionStorage.getItem("eventSearchQuery");
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }

    const savedActiveCard = sessionStorage.getItem("eventActiveCard");
    if (savedActiveCard) {
      setActiveCard(parseInt(savedActiveCard, 10));
    }

    // Use requestIdleCallback for non-critical initialization on mobile
    if (isMobileView && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => setIsLoaded(true));
    } else {
      const timer = requestAnimationFrame(() => {
        setIsLoaded(true);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [location.pathname, isMobileView]);

  // Callbacks
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    sessionStorage.setItem("eventSearchQuery", query);
  }, []);

  const handleCardClick = useCallback(
    (cardId) => {
      const newActiveCard = activeCard === cardId ? null : cardId;
      setActiveCard(newActiveCard);

      if (newActiveCard !== null) {
        sessionStorage.setItem("eventActiveCard", newActiveCard.toString());
      } else {
        sessionStorage.removeItem("eventActiveCard");
      }
    },
    [activeCard]
  );

  // Handle register button click with authentication check
  const handleRegisterClick = useCallback((e, registerLink) => {
    e.preventDefault();
    
    if (user) {
      // User is logged in, proceed to registration link
      window.location.href = registerLink;
      window.target = "_blank"
    } else {
      // User is not logged in, redirect to login page
      navigate('/signup', { 
        state: { 
          returnUrl: location.pathname,
          registerLink: registerLink 
        } 
      });
    }
  }, [user, navigate, location.pathname]);

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
            animate={animationVariants.backgroundGradient}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={animationVariants.backgroundGradient}
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
            Campus Events
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Discover and join amazing events from university clubs
          </p>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm
              border border-gray-700/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Upcoming Events
        </h2>

        {filteredUpcomingEvents.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No upcoming events found
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {filteredUpcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isActive={activeCard === event.id}
              onCardClick={handleCardClick}
              handleRegisterClick={handleRegisterClick}
              isPastEvent={false}
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
              Past Events
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
                    No past events found matching your search
                  </p>
                )}
                
                {/* Show limited number of past events initially */}
                {filteredPastEvents.slice(0, isMobileView ? visiblePastEvents : filteredPastEvents.length).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isActive={activeCard === event.id}
                    onCardClick={handleCardClick}
                    handleRegisterClick={handleRegisterClick}
                    isPastEvent={true}
                  />
                ))}
                
                {/* Load more button for mobile */}
                {isMobileView && filteredPastEvents.length > visiblePastEvents && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg text-gray-300 mt-4 transition-colors duration-300"
                    onClick={() => {
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
    </motion.div>
  );
};

export default LandingPage;