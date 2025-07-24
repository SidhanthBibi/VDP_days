"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Upload, Globe, Users, DollarSign } from "lucide-react"
import { supabase } from "../lib/supabaseClient"
import { v4 as uuidv4 } from "uuid"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const EventForm = () => {
  const [formData, setFormData] = useState({
    event_name: "",
    club_name: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location: "",
    description: "",
    price: "",
    websiteLink: "",
    whatsapp_group_link: "",
    variable_pricing: false,
    max_participants: 1,
    pricing_tiers: [],
    has_coordinators: false,
    num_coordinators: 1,
    event_coordinators: [],
  })

  const [clubs, setClubs] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch clubs from database
  useEffect(() => {
    fetchClubs()
  }, [])

  const fetchClubs = async () => {
    try {
      const { data, error } = await supabase.from("Clubs").select("id, name").order("name")
      if (error) throw error
      setClubs(data || [])
    } catch (err) {
      console.error("Error fetching clubs:", err)
      toast.error("Failed to load clubs")
    }
  }

  // Handle variable pricing toggle
  const handleVariablePricingToggle = (checked) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        variable_pricing: checked,
      }
      if (checked) {
        // Initialize pricing tiers when variable pricing is enabled
        newData.pricing_tiers = Array.from({ length: prev.max_participants }, (_, i) => ({
          participant_count: i + 1,
          price: "",
        }))
      } else {
        // Clear pricing tiers when disabled
        newData.pricing_tiers = []
      }
      return newData
    })
  }

  // Handle max participants change
  const handleMaxParticipantsChange = (value) => {
    // Allow empty string during typing
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        max_participants: "",
        pricing_tiers: [],
      }))
      return
    }
    const maxParticipants = Number.parseInt(value)
    // Only update if it's a valid number
    if (!isNaN(maxParticipants) && maxParticipants > 0) {
      setFormData((prev) => ({
        ...prev,
        max_participants: maxParticipants,
        pricing_tiers: Array.from({ length: maxParticipants }, (_, i) => ({
          participant_count: i + 1,
          price: prev.pricing_tiers[i]?.price || "",
        })),
      }))
    }
  }

  // Handle pricing tier change
  const handlePricingTierChange = (index, price) => {
    setFormData((prev) => ({
      ...prev,
      pricing_tiers: prev.pricing_tiers.map((tier, i) => (i === index ? { ...tier, price } : tier)),
    }))
  }

  // Handle coordinators toggle
  const handleCoordinatorsToggle = (checked) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        has_coordinators: checked,
      }
      if (checked) {
        // Initialize coordinators when enabled
        newData.event_coordinators = Array.from({ length: prev.num_coordinators }, () => ({
          coordinator_name: "",
          coordinator_number: "",
        }))
      } else {
        // Clear coordinators when disabled
        newData.event_coordinators = []
      }
      return newData
    })
  }

  // Handle number of coordinators change
  const handleNumCoordinatorsChange = (value) => {
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        num_coordinators: "",
        event_coordinators: [],
      }))
      return
    }
    const numCoordinators = Number.parseInt(value)
    if (!isNaN(numCoordinators) && numCoordinators > 0) {
      setFormData((prev) => ({
        ...prev,
        num_coordinators: numCoordinators,
        event_coordinators: Array.from({ length: numCoordinators }, (_, i) => ({
          coordinator_name: prev.event_coordinators[i]?.coordinator_name || "",
          coordinator_number: prev.event_coordinators[i]?.coordinator_number || "",
        })),
      }))
    }
  }

  // Handle coordinator field change
  const handleCoordinatorChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      event_coordinators: prev.event_coordinators.map((coordinator, i) =>
        i === index ? { ...coordinator, [field]: value } : coordinator,
      ),
    }))
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === "variable_pricing") {
      handleVariablePricingToggle(checked)
    } else if (name === "has_coordinators") {
      handleCoordinatorsToggle(checked)
    } else if (name === "max_participants") {
      handleMaxParticipantsChange(value)
    } else if (name === "num_coordinators") {
      handleNumCoordinatorsChange(value)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let posterUrl = null

      // Handle image upload if an image is selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `events/${fileName}`

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("assets").getPublicUrl(filePath)

        posterUrl = publicUrl
      }

      // Prepare price data based on variable pricing
      let priceData
      if (formData.variable_pricing) {
        priceData = JSON.stringify(formData.pricing_tiers)
      } else {
        priceData = formData.price
      }

      // Validate coordinator data if enabled
      if (formData.has_coordinators) {
        for (const coordinator of formData.event_coordinators) {
          if (!coordinator.coordinator_name.trim() || !coordinator.coordinator_number.trim()) {
            throw new Error("All coordinator fields are required")
          }
          // Validate phone number
          const phoneRegex = /^[0-9]{10}$/
          if (!phoneRegex.test(coordinator.coordinator_number.replace(/\D/g, ""))) {
            throw new Error("Please enter valid 10-digit coordinator phone numbers")
          }
        }
      }

      // Insert event data into the events table
      const { error: insertError, data } = await supabase.from("Events").insert([
        {
          event_name: formData.event_name,
          club_name: formData.club_name,
          description: formData.description,
          start_date: formData.start_date,
          start_time: formData.start_time,
          end_date: formData.end_date,
          end_time: formData.end_time,
          location: formData.location,
          price: priceData,
          websiteLink: formData.websiteLink,
          whatsapp_group_link: formData.whatsapp_group_link,
          poster: posterUrl,
          variable_pricing: formData.variable_pricing,
          max_participants: formData.variable_pricing ? formData.max_participants : null,
          has_coordinators: formData.has_coordinators,
          event_coordinators: formData.has_coordinators ? formData.event_coordinators : null,
        },
      ])

      if (insertError) {
        console.error("Insert Error:", insertError)
        throw insertError
      }

      console.log("Insert successful:", data)

      // Reset form after successful submission
      setFormData({
        event_name: "",
        club_name: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: "",
        location: "",
        description: "",
        price: "",
        websiteLink: "",
        whatsapp_group_link: "",
        variable_pricing: false,
        max_participants: 1,
        pricing_tiers: [],
        has_coordinators: false,
        num_coordinators: 1,
        event_coordinators: [],
      })
      setImageFile(null)
      setPreviewUrl(null)

      // Show success toast notification
      toast.success("Event created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      })
    } catch (err) {
      setError(err.message)
      toast.error(err.message || "An error occurred while creating the event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
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

      {/* Neon Circle Accents */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-3xl mx-auto relative">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Create New Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            {/* Image Upload */}
            <div className="mb-8">
              <div
                className="w-80 h-100 mx-auto rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => document.getElementById("image-upload").click()}
              >
                {previewUrl ? (
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400 text-sm">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">3:4 ratio</p>
                  </div>
                )}
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="Event Title"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Club Dropdown */}
            <div className="mb-6">
              <select
                name="club_name"
                value={formData.club_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Organizing Club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.name}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Coordinators Section */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Event Coordinators</h3>
              {/* Coordinators Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="has_coordinators"
                  name="has_coordinators"
                  checked={formData.has_coordinators}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="has_coordinators" className="text-sm font-medium text-gray-300">
                  Add Event Coordinators
                </label>
              </div>

              {formData.has_coordinators && (
                <div className="space-y-4">
                  {/* Number of Coordinators */}
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="num_coordinators"
                      value={formData.num_coordinators}
                      onChange={handleChange}
                      placeholder="Number of Coordinators"
                      min="1"
                      max="10"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Dynamic Coordinator Fields */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">Coordinator Details</label>
                    {formData.event_coordinators.map((coordinator, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                      >
                        <input
                          type="text"
                          value={coordinator.coordinator_name}
                          onChange={(e) => handleCoordinatorChange(index, "coordinator_name", e.target.value)}
                          placeholder={`Coordinator ${index + 1} Name`}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="tel"
                          value={coordinator.coordinator_number}
                          onChange={(e) => handleCoordinatorChange(index, "coordinator_number", e.target.value)}
                          placeholder={`Coordinator ${index + 1} Number`}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start Date and Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Start</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* End Date and Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Event End</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event Location"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Pricing Section */}
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-300">Pricing</h3>
              {/* Variable Pricing Toggle */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="variable_pricing"
                  name="variable_pricing"
                  checked={formData.variable_pricing}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="variable_pricing" className="text-sm font-medium text-gray-300">
                  Variable Pricing
                </label>
              </div>

              {formData.variable_pricing ? (
                <div className="space-y-4">
                  {/* Max Participants */}
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleChange}
                      placeholder="Maximum Participants"
                      min="1"
                      max="50"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {/* Dynamic Pricing Fields */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">Pricing Tiers</label>
                    {formData.pricing_tiers.map((tier, index) => (
                      <div key={index} className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={tier.price}
                          onChange={(e) => handlePricingTierChange(index, e.target.value)}
                          placeholder={`Pricing for ${tier.participant_count} participant${
                            tier.participant_count > 1 ? "s" : ""
                          }`}
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Price */
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price for the event"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* Website Link */}
            <div className="mb-6 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
                placeholder="Website link"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* WhatsApp Group Link */}
            <div className="mb-6 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              <input
                type="url"
                name="whatsapp_group_link"
                value={formData.whatsapp_group_link}
                onChange={handleChange}
                placeholder="WhatsApp Group Link"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[20px]
                 hover:from-blue-600 hover:to-purple-700 transition-all duration-300
                 shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm
