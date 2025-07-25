"use client"
import React from "react"
import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, ExternalLink, Loader2, RefreshCw } from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const MainEvent = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMainEvents()
  }, [])

  const fetchMainEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .eq("event_type", "main")
        .order("created_at", { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error("Error fetching main events:", err)
      setError(err.message)
      toast.error("Failed to load main events")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "TBD"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "TBD"
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleRetry = () => {
    fetchMainEvents()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Loading main events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
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
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Main Events
          </h1>
          <p className="text-gray-400 text-lg">Discover major events and their associated sub-events</p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-300">No Main Events Found</h3>
            <p className="text-gray-400">There are currently no main events available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="backdrop-blur-md bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(66,153,225,0.3)] group"
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
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Main Event
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {event.event_name}
                  </h3>
                  <p className="text-blue-400 font-medium mb-4">Organized by {event.club_name}</p>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>

                  <div className="space-y-2 text-gray-300 text-sm mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                      <span>
                        {formatDate(event.start_date)} - {formatDate(event.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-400" />
                      <span>
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/main-event/${event.id}`}
                      className="flex-1 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
                    >
                      View Details
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

export default MainEvent
