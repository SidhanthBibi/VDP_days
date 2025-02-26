import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  CircleDollarSign,
  ArrowUpRight,
} from "lucide-react";

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State declarations
  const [activeCard, setActiveCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData, error: supabaseError } = await supabase
          .from("Events")
          .select("*")
          .order('date',{ascending:true});

        if (supabaseError) throw supabaseError;
        setData(eventsData);
      } catch (err) {
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

    const timer = requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

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

  // Filter events
  const filteredEvents = data.filter((event) => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;

    return (
      event.event_name?.toLowerCase().includes(searchLower) ||
      event.club_name?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900 flex items-center justify-center"
      >
        <motion.div
          animate={{
            rotate: 360,
            borderColor: ["#3B82F6", "#8B5CF6", "#3B82F6"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white px-4 py-8"
    >
      {/* Background Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
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
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"
      />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto mb-16 relative"
      >
        <div className="text-center">
          <motion.h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Campus Events
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-8"
          >
            Discover and join amazing events from university clubs
          </motion.p>
          <motion.input
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm
              border border-gray-700/50 transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
      >
        <AnimatePresence>
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer aspect-[3/4] w-full"
              onClick={() => handleCardClick(event.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 rounded-xl z-10" />
              <img
                src={event.poster}
                alt={event.event_name}
                className="w-full h-full object-cover rounded-xl"
              />

              <AnimatePresence>
                {activeCard === event.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-0 backdrop-blur-md bg-gray-900/50 rounded-xl p-6
                      border border-gray-700/50 z-20"
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <motion.h3
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="text-2xl font-bold mb-2"
                        >
                          {event.event_name}
                        </motion.h3>
                        <motion.p
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-blue-400 mb-4"
                        >
                          {event.club_name}
                        </motion.p>
                        <motion.p
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-300 mb-6 line-clamp-4"
                        >
                          {event.description}
                        </motion.p>

                        <motion.div className="space-y-3">
                          {[
                            {
                              icon: <Calendar className="w-4 h-4 mr-2" />,
                              text: event.date,
                            },
                            {
                              icon: <Clock className="w-4 h-4 mr-2" />,
                              text: event.time,
                            },
                            {
                              icon: <MapPin className="w-4 h-4 mr-2" />,
                              text: event.location,
                            },
                            {
                              icon: (
                                <CircleDollarSign className="w-4 h-4 mr-2" />
                              ),
                              text: event.price,
                            },
                          ].map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-center text-gray-300"
                            >
                              {item.icon}
                              <span>{item.text}</span>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                      <div className="flex justify-center gap-5">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="mt-4 bg-white text-black px-6 py-3 rounded-[10px] w-1/2
                              transition-all duration-300
                              shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
                        >
                          <a href={event.websiteLink}>Visit Website</a>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[10px] 
                              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 w-1/2
                              shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
                          onClick={(e) => handleRegisterClick(e, event.register_link)}
                        >
                          Register Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;