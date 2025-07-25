"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, CircleDollarSign } from "lucide-react"
import { formatVariablePricing } from "../utils/pricingUtils"
import { formatDate, formatTime } from "../utils/dateUtils"

// Check if device is mobile
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768

const EventCard = React.memo(({ event, isActive, onCardClick, handleRegisterClick, isPastEvent }) => {
  const isMobileView = isMobile()

  // Format event date and time for display
  const eventStartDate = formatDate(event.start_date)
  const eventStartTime = formatTime(event.start_time)
  const eventEndDate = formatDate(event.end_date)
  const eventEndTime = formatTime(event.end_time)

  // Create display strings for date/time
  const dateDisplay = eventStartDate === eventEndDate ? eventStartDate : `${eventStartDate} - ${eventEndDate}`

  const timeDisplay = eventStartTime === eventEndTime ? eventStartTime : `${eventStartTime} - ${eventEndTime}`

  // Format pricing display
  const priceDisplay = formatVariablePricing(event)

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
        src={event.poster || "/placeholder.svg?height=400&width=300"}
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
                    onClick={(e) => handleRegisterClick(e, `/main-event/${event.id}`)}
                  >
                    View Events
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
                  <a href={`/main-event/${event.id}`}>Event Expired</a>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default EventCard
