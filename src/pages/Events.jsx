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

const EventCard = React.memo(({ event, isActive, onCardClick, handleRegisterClick, isPastEvent }) => {
  const isMobileView = isMobile();
  
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
                <motion.h3 className="text-2xl font-bold mb-2">
                  {event.event_name}
                </motion.h3>
                <motion.p className="text-blue-400 mb-4">
                  {event.club_name}
                </motion.p>
                <motion.p className="text-gray-300 mb-6 line-clamp-4">
                  {event.description}
                </motion.p>

                <div className="space-y-3">
                  {[
                    { icon: <Calendar className="w-4 h-4 mr-2" />, text: event.date },
                    { icon: <Clock className="w-4 h-4 mr-2" />, text: event.time },
                    { icon: <MapPin className="w-4 h-4 mr-2" />, text: event.location },
                    { icon: <CircleDollarSign className="w-4 h-4 mr-2" />, text: event.price },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {!isPastEvent ? (
                <div className="flex justify-center gap-5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 bg-white text-black px-6 py-3 rounded-[10px] w-1/2
                        transition-all duration-300
                        shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  >
                    <a href={event.websiteLink}>Visit</a>
                  </motion.button>
                  <motion.button
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
          .order('date', { ascending: true });

        if (supabaseError) throw supabaseError;
        
        const now = new Date();
        const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const today = indiaTime.toISOString().split('T')[0];
        
        // Separate past and upcoming events
        const past = [];
        const upcoming = [];
        
        eventsData.forEach(event => {
          let eventDate = event.date;
          
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
      navigate('/login', { 
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
                
                {/* Use windowing for past events on mobile to improve performance */}
                {filteredPastEvents.slice(0, isMobileView ? 6 : filteredPastEvents.length).map((event) => (
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
                {isMobileView && filteredPastEvents.length > 6 && (
                  <button
                    className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800 py-3 rounded-lg text-gray-300 mt-4"
                    onClick={() => {
                      // This would be expanded to implement pagination or load more functionality
                      alert("Load more functionality would be implemented here");
                    }}
                  >
                    Load More Events
                  </button>
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