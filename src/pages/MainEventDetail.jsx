"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  MessageCircle,
  Phone,
  ArrowLeft,
  Loader2,
  Info,
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const MainEventDetail = () => {
  const { eventId } = useParams()
  const [mainEvent, setMainEvent] = useState(null)
  const [subEvents, setSubEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

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

  const renderPrice = (event) => {
    if (event.variable_pricing && event.price) {
      try {
        const pricingTiers = JSON.parse(event.price)
        if (Array.isArray(pricingTiers) && pricingTiers.length > 0) {
          const minPrice = Math.min(...pricingTiers.map((tier) => Number.parseFloat(tier.price) || 0))
          const maxPrice = Math.max(...pricingTiers.map((tier) => Number.parseFloat(tier.price) || 0))
          return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`
        }
      } catch (e) {
        return event.price || "Free"
      }
    }
    return event.price || "Free"
  }

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
          to="/main-events"
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
          to="/main-events"
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
            to="/main-events"
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
          Associated Sub Events ({subEvents.length})
        </h2>

        {subEvents.length === 0 ? (
          <div className="text-center py-10 backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            <p className="text-xl text-gray-400">No Sub Events found for this Main Event.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subEvents.map((event) => (
              <div
                key={event.id}
                className="backdrop-blur-md bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] group"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.poster ? (
                    <img
                      src={event.poster || "/placeholder.svg"}
                      alt={event.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sub Event
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                      {renderPrice(event)}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {event.event_name}
                  </h3>
                  <p className="text-purple-400 font-medium text-sm mb-3">Organized by {event.club_name}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>

                  <div className="space-y-2 text-gray-300 text-sm mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      <span>
                        {formatDate(event.start_date)} - {formatDate(event.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      <span>
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && event.variable_pricing && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        <span>Max Participants: {event.max_participants}</span>
                      </div>
                    )}
                  </div>

                  {event.has_coordinators && event.event_coordinators && event.event_coordinators.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Coordinators:</h4>
                      <div className="space-y-1">
                        {event.event_coordinators.slice(0, 2).map((coordinator, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">{coordinator.coordinator_name}</span>
                            <a
                              href={`tel:${coordinator.coordinator_number}`}
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {coordinator.coordinator_number}
                            </a>
                          </div>
                        ))}
                        {event.event_coordinators.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{event.event_coordinators.length - 2} more coordinators
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/events/${event.id}/register/`}
                      className="flex-1 text-center bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium"
                    >
                      Register
                    </Link>

                    {event.websiteLink && (
                      <a
                        href={event.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        title="Visit Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {event.whatsapp_group_link && (
                      <a
                        href={event.whatsapp_group_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        title="Join WhatsApp Group"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainEventDetail
