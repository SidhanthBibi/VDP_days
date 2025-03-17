import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, Users, Clock, MapPin, CircleDollarSign, ArrowLeft } from 'lucide-react';
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

const SubEventCard = React.memo(({ event, isActive, onCardClick, handleRegisterClick, isPastEvent }) => {
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
        src={event.poster || "/placeholder.svg"}
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

const SubEventsPage = () => {
  const { mainEventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Add responsive state
  const [isMobileView, setIsMobileView] = useState(isMobile);
  
  // State declarations
  const [activeCard, setActiveCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainEvent, setMainEvent] = useState(null);
  const [subEvents, setSubEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pastSubEvents, setPastSubEvents] = useState([]);
  const [upcomingSubEvents, setUpcomingSubEvents] = useState([]);
  
  // New state variables for access control
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [haveAccess, setHaveAccess] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  // Function to check user access
  const checkUserAccess = (clubData, userEmail) => {
    if (!userEmail) return false;

    // Check if user is the coordinator
    if (clubData.Club_Coordinator === userEmail) {
      return true;
    }

    // Check if user's email is in the access array
    if (Array.isArray(clubData.access) && clubData.access.includes(userEmail)) {
      return true;
    }

    return false;
  };

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

  // Fetch main event and sub-events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the main event
        const { data: mainEventData, error: mainEventError } = await supabase
          .from("MainEvents")
          .select("*")
          .eq("id", mainEventId)
          .single();

        if (mainEventError) throw mainEventError;
        
        setMainEvent(mainEventData);

        // Fetch sub-events for this main event
        const { data: subEventsData, error: subEventsError } = await supabase
          .from("SubEvents")
          .select("*")
          .eq("main_event_id", mainEventId)
          .order('start_date', { ascending: true });

        if (subEventsError) throw subEventsError;
        
        const now = new Date();
        const indiaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        const today = indiaTime.toISOString().split('T')[0];
        
        // Separate past and upcoming events
        const past = [];
        const upcoming = [];
        
        subEventsData.forEach(event => {
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
        
        setUpcomingSubEvents(upcoming);
        setPastSubEvents(past);
        setSubEvents(subEventsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        toast.error("Failed to load events: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mainEventId]);

  // Check if the user has access to the main event's club
  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUserEmail || !mainEvent) return;

      try {
        // Get the club that created this main event
        const { data: clubData, error } = await supabase
          .from("Clubs")
          .select("*")
          .eq("name", mainEvent.club_name)
          .single();

        if (error) {
          console.error("Error fetching club data:", error);
          return;
        }

        // Check if current user is the coordinator
        const isUserCoordinator = clubData.Club_Coordinator === currentUserEmail;
        setIsCoordinator(isUserCoordinator);

        // Set haveAccess flag - this will be true for both coordinators and users in access array
        const hasAccess = checkUserAccess(clubData, currentUserEmail);
        setHaveAccess(hasAccess);
      } catch (err) {
        console.error("Error checking access:", err);
      }
    };

    if (currentUserEmail && mainEvent) {
      checkAccess();
    }
  }, [currentUserEmail, mainEvent]);

  // Callbacks
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCardClick = useCallback(
    (cardId) => {
      const newActiveCard = activeCard === cardId ? null : cardId;
      setActiveCard(newActiveCard);
    },
    [activeCard]
  );

  // Handle register button click with authentication check
  const handleRegisterClick = useCallback((e, registerLink) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering card click
    
    if (user) {
      // User is logged in, proceed to registration link
      window.open(registerLink, "_blank");
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

  // Filter sub-events based on search query - memoized
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
  const filteredUpcomingSubEvents = useMemo(() => 
    filterEvents(upcomingSubEvents),
    [filterEvents, upcomingSubEvents]
  );
  
  const filteredPastSubEvents = useMemo(() => 
    filterEvents(pastSubEvents),
    [filterEvents, pastSubEvents]
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

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => navigate('/main-events')}
          className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Main Events
        </button>
      </div>

      {/* Main Event Header */}
      {mainEvent && (
        <div className="max-w-7xl mx-auto mb-12">
          <div className="relative rounded-xl overflow-hidden h-64 mb-8">
            <img 
              src={mainEvent.poster || "/placeholder.svg"} 
              alt={mainEvent.event_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-4xl font-bold mb-2">{mainEvent.event_name}</h1>
              <p className="text-blue-400 text-xl">{mainEvent.club_name}</p>
              <div className="flex items-center mt-2 text-gray-300">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(mainEvent.start_date)} - {formatDate(mainEvent.end_date)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 max-w-3xl mb-8">{mainEvent.description}</p>
          
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search sub-events..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-md bg-gray-800/50 text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm
                border border-gray-700/50 transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Upcoming Sub-Events Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Upcoming Sub-Events
        </h2>

        {filteredUpcomingSubEvents.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No upcoming sub-events found
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {filteredUpcomingSubEvents.map((event) => (
            <SubEventCard
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

      {/* Past Sub-Events Section */}
      {filteredPastSubEvents.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
            Past Sub-Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {filteredPastSubEvents.map((event) => (
              <SubEventCard
                key={event.id}
                event={event}
                isActive={activeCard === event.id}
                onCardClick={handleCardClick}
                handleRegisterClick={handleRegisterClick}
                isPastEvent={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create New Sub-Event Button - Only show if user has access */}
      {(isCoordinator || haveAccess) && (
        <div className="fixed bottom-8 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full 
                shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
            onClick={() => navigate(`/create-sub-event/${mainEventId}`)}
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

export default SubEventsPage;