"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { Calendar, Clock, Users, ExternalLink, ArrowLeft, Loader2, Info } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import EventCard from "../components/EventCard" // Import EventCard

const MainEventDetail = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [mainEvent, setMainEvent] = useState(null)
  const [subEvents, setSubEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null) // State for user authentication
  const [activeCard, setActiveCard] = useState(null) // State for active EventCard

  useEffect(() => {
    fetchEventDetails()
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [eventId])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchEventDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch main event details
      const { data: mainEventData, error: mainEventError } = await supabase
        .from("Events")
        .select("*")
        .eq("id", eventId)
        .eq("event_type", "main")
        .single()

      if (mainEventError) {
        if (mainEventError.code === "PGRST116") {
          // No rows found
          setError("Main Event not found or is not a Main Event.")
        } else {
          throw mainEventError
        }
      } else {
        setMainEvent(mainEventData)

        // Fetch associated sub events
        const { data: subEventsData, error: subEventsError } = await supabase
          .from("Events")
          .select("*")
          .eq("parent_event_id", eventId)
          .eq("event_type", "sub")
          .order("start_date", { ascending: true })

        if (subEventsError) throw subEventsError
        setSubEvents(subEventsData || [])
      }
    } catch (err) {
      console.error("Error fetching event details:", err)
      setError(err.message)
      toast.error("Failed to load event details: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "TBD"
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "TBD"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleCardClick = useCallback((id) => {
    setActiveCard((prevActiveCard) => (prevActiveCard === id ? null : id))
  }, [])

  const handleRegisterClick = useCallback(
    (e, path) => {
      e.stopPropagation() // Prevent card from closing
      if (!user) {
        toast.error("Please log in to register for events.")
        navigate("/login")
      } else {
        navigate(path)
      }
    },
    [user, navigate],
  )

  const getIsPastEvent = useCallback((event) => {
    const eventEndDateTime = new Date(`${event.end_date}T${event.end_time}`)
    return eventEndDateTime < new Date()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-4">
          <Info className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-400 text-center mb-6">{error}</p>
        <Link
          to="/main-event"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main Events
        </Link>
      </div>
    )
  }

  if (!mainEvent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-gray-500 mb-4">
          <Info className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <p className="text-gray-400 text-center mb-6">The main event you are looking for does not exist.</p>
        <Link
          to="/main-event"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Main Events
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
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

      {/* Background Effects */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/main-event"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Main Events
          </Link>
        </div>

        {/* Main Event Details Section */}
        <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 mb-12">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Event Poster */}
            {mainEvent.poster && (
              <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={mainEvent.poster || "/placeholder.svg"}
                  alt={mainEvent.event_name}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                {mainEvent.event_name}
              </h1>
              <p className="text-gray-300 mb-6 text-lg">{mainEvent.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p>{formatDate(mainEvent.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p>
                      {formatTime(mainEvent.start_time)} - {formatTime(mainEvent.end_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Organized by</p>
                    <p>{mainEvent.club_name}</p>
                  </div>
                </div>
                {mainEvent.websiteLink && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <ExternalLink className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Website</p>
                      <a
                        href={mainEvent.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sub Events Section */}
        <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
          Associated Sub Events
        </h2>

        {subEvents.length === 0 ? (
          <div className="text-center py-10 backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            <p className="text-xl text-gray-400">No Sub Events found for this Main Event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isActive={activeCard === event.id}
                onCardClick={handleCardClick}
                handleRegisterClick={handleRegisterClick}
                isPastEvent={getIsPastEvent(event)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainEventDetail
