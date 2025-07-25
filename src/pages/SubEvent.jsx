"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { Link } from "react-router-dom"
import { Calendar, Clock, MapPin, Users, Phone, ExternalLink, MessageCircle, Loader2, RefreshCw } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const SubEvent = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubEvents()
  }, [])

  const fetchSubEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("Events")
        .select(
          `
          *,
          parent_event:parent_event_id(event_name, club_name)
        `,
        )
        .eq("event_type", "sub")
        .order("created_at", { ascending: false })

      if (error) throw error

      setEvents(data || [])
    } catch (err) {
      console.error("Error fetching sub events:", err)
      setError(err.message)
      toast.error("Failed to load sub events")
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
        return (
          <div className="space-y-1">
            <span className="text-xs text-purple-400 font-medium">Variable Pricing</span>
            {pricingTiers.slice(0, 2).map((tier, index) => (
              <div key={index} className="text-xs text-gray-300">
                {tier.participant_count} participant{tier.participant_count > 1 ? "s" : ""}: {tier.price}
              </div>
            ))}
            {pricingTiers.length > 2 && (
              <div className="text-xs text-gray-400">+{pricingTiers.length - 2} more tiers</div>
            )}
          </div>
        )
      } catch (e) {
        return <span className="text-sm text-gray-300">{event.price}</span>
      }
    }
    return <span className="text-sm text-gray-300">{event.price || "Free"}</span>
  }

  const handleRetry = () => {
    fetchSubEvents()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading sub events...</p>
        </div>
      </div>
    )
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
        <h2 className="text-2xl font-bold mb-2">Error Loading Events</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
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

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
            Sub Events
          </h1>
          <p className="text-gray-400 text-lg">Explore detailed sub events with advanced features</p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-300">No Sub Events Found</h3>
            <p className="text-gray-400">There are currently no sub events available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="backdrop-blur-md bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] group"
              >
                {/* Event Image */}
                <div className="relative h-64 overflow-hidden">
                  {event.poster ? (
                    <img
                      src={event.poster || "/placeholder.svg"}
                      alt={event.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Event Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Sub Event
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      {renderPrice(event)}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  {/* Parent Event Info */}
                  {event.parent_event && (
                    <div className="mb-3">
                      <span className="text-xs text-gray-400">Part of:</span>
                      <Link
                        to={`/main-event/${event.parent_event_id}`}
                        className="text-sm text-blue-400 font-medium hover:underline"
                      >
                        {event.parent_event.event_name}
                      </Link>
                    </div>
                  )}

                  {/* Event Title */}
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                    {event.event_name}
                  </h3>

                  {/* Club Name */}
                  <p className="text-purple-400 font-medium mb-4">Organized by {event.club_name}</p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      <span className="text-sm">
                        {formatDate(event.start_date)} - {formatDate(event.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      <span className="text-sm">
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="text-sm">Max {event.max_participants} participants</span>
                      </div>
                    )}
                  </div>

                  {/* Event Coordinators */}
                  {event.has_coordinators && event.event_coordinators && (
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

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">{event.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/events/${event.id}/register`}
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

export default SubEvent
