"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabaseClient"
import { useLocation, useNavigate, Link } from "react-router-dom" // Import Link
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import EventCard from "../components/MainEventCard";

// Check if device is mobile
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
)

// Define simpler animation variants for mobile
const getAnimationVariants = (isMobileView) => ({
  backgroundGradient: isMobileView
    ? { scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1], transition: { duration: 10 } }
    : { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], transition: { duration: 8 } },
  fadeIn: { opacity: [0, 1], transition: { duration: 0.3 } },
  cardHover: isMobileView ? {} : { scale: 1.02 },
})

const MainEvent = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Add responsive state
  const [isMobileView, setIsMobileView] = useState(isMobile)

  // Animation variants based on device
  const animationVariants = useMemo(() => getAnimationVariants(isMobileView), [isMobileView])

  // State declarations
  const [activeCard, setActiveCard] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState([]) // This state might not be strictly necessary if upcoming/past are used
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [visiblePastEvents, setVisiblePastEvents] = useState(6) // Number of past events initially visible

  // Handle resize events for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Check user authentication
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    checkUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Fetch data and separate past and upcoming events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: eventsData, error: supabaseError } = await supabase
          .from("Events")
          .select("*")
          .eq("event_type", "main") // Filter for Main Events
          .order("start_date", { ascending: true })

        if (supabaseError) throw supabaseError

        const now = new Date()
        const indiaTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000)
        const today = indiaTime.toISOString().split("T")[0]

        // Separate past and upcoming events
        const past = []
        const upcoming = []

        eventsData.forEach((event) => {
          let eventDate = event.start_date

          try {
            const dateParts = eventDate.split("-")

            if (dateParts.length === 3 && dateParts[0].length === 2 && dateParts[2].length === 4) {
              eventDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
            }

            const eventDateObj = new Date(eventDate)
            const todayDateObj = new Date(today)

            eventDateObj.setHours(0, 0, 0, 0)
            todayDateObj.setHours(0, 0, 0, 0)

            if (eventDateObj < todayDateObj) {
              past.push(event)
            } else {
              upcoming.push(event)
            }
          } catch (e) {
            // Default to upcoming if date parsing fails
            upcoming.push(event)
          }
        })

        setUpcomingEvents(upcoming)
        setPastEvents(past)
        setData(eventsData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
        toast.error("Failed to load Main Events: " + err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Session storage and loading effect
  useEffect(() => {
    setIsLoaded(false)
    const savedSearchQuery = sessionStorage.getItem("mainEventSearchQuery") // Use a different key
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery)
    }

    const savedActiveCard = sessionStorage.getItem("mainEventActiveCard") // Use a different key
    if (savedActiveCard) {
      setActiveCard(Number.parseInt(savedActiveCard, 10))
    }

    // Use requestIdleCallback for non-critical initialization on mobile
    if (isMobileView && typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => setIsLoaded(true))
    } else {
      const timer =
        typeof window !== "undefined"
          ? requestAnimationFrame(() => {
              setIsLoaded(true)
            })
          : null
      return () => {
        if (timer) cancelAnimationFrame(timer)
      }
    }
  }, [location.pathname, isMobileView])

  // Callbacks
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
    sessionStorage.setItem("mainEventSearchQuery", query) // Use a different key
  }, [])

  const handleCardClick = useCallback(
    (cardId) => {
      const newActiveCard = activeCard === cardId ? null : cardId
      setActiveCard(newActiveCard)

      if (newActiveCard !== null) {
        sessionStorage.setItem("mainEventActiveCard", newActiveCard.toString()) // Use a different key
      } else {
        sessionStorage.removeItem("mainEventActiveCard") // Use a different key
      }
    },
    [activeCard],
  )

  // Handle register button click with authentication check
  const handleRegisterClick = useCallback(
    (e, registerLink) => {
      e.preventDefault()

      if (user) {
        // User is logged in, proceed to registration link
        window.location.href = registerLink
        window.target = "_blank"
      } else {
        // User is not logged in, redirect to login page
        navigate("/signup", {
          state: {
            returnUrl: location.pathname,
            registerLink: registerLink,
          },
        })
      }
    },
    [user, navigate, location.pathname],
  )

  // Toggle past events visibility
  const togglePastEvents = useCallback(() => {
    setShowPastEvents(!showPastEvents)
    // Reset visible past events count when toggling
    if (!showPastEvents) {
      setVisiblePastEvents(6)
    }
  }, [showPastEvents])

  // Filter events based on search query - memoized
  const filterEvents = useCallback(
    (events) => {
      return events.filter((event) => {
        const searchLower = searchQuery.toLowerCase().trim()
        if (!searchLower) return true

        return (
          event.event_name?.toLowerCase().includes(searchLower) ||
          event.club_name?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower)
        )
      })
    },
    [searchQuery],
  )

  // Memoize filtered events to prevent unnecessary re-renders
  const filteredUpcomingEvents = useMemo(() => filterEvents(upcomingEvents), [filterEvents, upcomingEvents])

  const filteredPastEvents = useMemo(() => filterEvents(pastEvents), [filterEvents, pastEvents])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Error Loading Main Events</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()} // Simple reload for retry
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    )
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
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={animationVariants.backgroundGradient}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
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
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
            Main Events
          </h1>
          <p className="text-xl text-gray-400 mb-8">Explore detailed sub-events from various main events</p>
          <input
            type="text"
            placeholder="Search Main Events..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-800/50 text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm
            border border-gray-700/50 transition-all duration-300"
          />
          {/* New Button to Explore All Main Events */}
          <Link
            to="/sub-event"
            className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore All Sub Events
          </Link>
        </div>
      </div>

      {/* Upcoming Main Events Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Upcoming Main Events
        </h2>

        {filteredUpcomingEvents.length === 0 && (
          <p className="text-center text-gray-400 py-10">No upcoming Main Events found</p>
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

      {/* Past Main Events Section - Only load if there are past events */}
      {pastEvents.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between cursor-pointer mb-8" onClick={togglePastEvents}>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
              Past Main Events
            </h2>
            <div className="bg-gray-800 p-2 rounded-full">
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
                    No past Main Events found matching your search
                  </p>
                )}

                {/* Show limited number of past events initially */}
                {filteredPastEvents
                  .slice(0, isMobileView ? visiblePastEvents : filteredPastEvents.length)
                  .map((event) => (
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
                      setVisiblePastEvents((prev) => Math.min(prev + 6, filteredPastEvents.length))
                    }}
                  >
                    Load More Events ({Math.min(visiblePastEvents, filteredPastEvents.length)} of{" "}
                    {filteredPastEvents.length})
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}

export default MainEvent
