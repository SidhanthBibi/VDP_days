"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { ArrowLeft, Users, DollarSign, Eye, X, ChevronDown, UserCheck, Download } from "lucide-react"
import { formatVariablePricing } from "../utils/pricingUtils"
import * as XLSX from "xlsx"

const EventRegistrationDashboard = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)
  const [showScreenshotModal, setShowScreenshotModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchEventAndRegistrations()
  }, [eventId])

  const fetchEventAndRegistrations = async () => {
    try {
      setLoading(true)
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from("Events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (eventError) throw eventError
      setEvent(eventData)

      // Fetch registrations for this event
      const { data: registrationsData, error: registrationsError } = await supabase
        .from("registrations")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false })

      if (registrationsError) throw registrationsError
      setRegistrations(registrationsData || [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (registrationId, newStatus) => {
    try {
      setUpdatingStatus(registrationId)
      // Update status in database
      const { data, error } = await supabase
        .from("registrations")
        .update({ status: newStatus })
        .eq("id", registrationId)
        .select()

      if (error) throw error

      // Update local state only if database update was successful
      setRegistrations((prev) => prev.map((reg) => (reg.id === registrationId ? { ...reg, status: newStatus } : reg)))

      // Optional: Show success message
      console.log("Payment status updated successfully")
    } catch (err) {
      console.error("Error updating status:", err)
      alert(`Failed to update payment status: ${err.message}`)
      // Revert the dropdown to previous state by refetching data
      fetchEventAndRegistrations()
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleViewScreenshot = (screenshotUrl) => {
    setSelectedScreenshot(screenshotUrl)
    setShowScreenshotModal(true)
  }

  const downloadExcel = async () => {
    try {
      setDownloading(true)

      // Prepare data for Excel export
      const excelData = []

      registrations.forEach((registration, regIndex) => {
        const baseData = {
          "S.No": regIndex + 1,
          "Team Name": registration.team_name,
          "Registration Date": new Date(registration.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          "Transaction ID": registration.transaction_id,
          "Total Participants": registration.participant_count || registration.participants?.length || 0,
          "Total Amount": `₹${getRegistrationAmount(registration).toLocaleString()}`,
          "Payment Status": registration.status.toUpperCase(),
        }

        // Add participant details
        if (registration.participants && Array.isArray(registration.participants)) {
          registration.participants.forEach((participant, partIndex) => {
            const participantData = {
              ...baseData,
              "Participant No.": partIndex + 1,
              "Full Name": participant.name || "",
              "Register Number": participant.registerNumber || "",
              "College Name": participant.college || "",
              "Phone Number": participant.phone || "",
              "Email Address": participant.email || "",
              Department: participant.department || "",
              Course: participant.course || "",
              Section: participant.section || "",
              "Year of Study": participant.year || "",
            }

            // Only add team-level data for the first participant to avoid repetition
            if (partIndex > 0) {
              participantData["S.No"] = ""
              participantData["Team Name"] = ""
              participantData["Registration Date"] = ""
              participantData["Transaction ID"] = ""
              participantData["Total Participants"] = ""
              participantData["Total Amount"] = ""
              participantData["Payment Status"] = ""
            }

            excelData.push(participantData)
          })
        } else {
          // If no participants data, add just the registration data
          excelData.push({
            ...baseData,
            "Participant No.": "",
            "Full Name": "",
            "Register Number": "",
            "College Name": "",
            "Phone Number": "",
            "Email Address": "",
            Department: "",
            Course: "",
            Section: "",
            "Year of Study": "",
          })
        }
      })

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Set column widths for better formatting
      const colWidths = [
        { wch: 6 }, // S.No
        { wch: 20 }, // Team Name
        { wch: 18 }, // Registration Date
        { wch: 20 }, // Transaction ID
        { wch: 12 }, // Total Participants
        { wch: 12 }, // Total Amount
        { wch: 12 }, // Payment Status
        { wch: 8 }, // Participant No.
        { wch: 25 }, // Full Name
        { wch: 15 }, // Register Number
        { wch: 30 }, // College Name
        { wch: 15 }, // Phone Number
        { wch: 30 }, // Email Address
        { wch: 20 }, // Department
        { wch: 15 }, // Course
        { wch: 10 }, // Section
        { wch: 12 }, // Year of Study
      ]
      ws["!cols"] = colWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Registrations")

      // Generate filename with event name and date
      const eventName = event.event_name.replace(/[^a-zA-Z0-9]/g, "_")
      const currentDate = new Date().toISOString().split("T")[0]
      const filename = `${eventName}_Registrations_${currentDate}.xlsx`

      // Download the file
      XLSX.writeFile(wb, filename)
    } catch (err) {
      console.error("Error downloading Excel file:", err)
      alert("Failed to download Excel file. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
        return "text-green-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-yellow-400"
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case "successful":
        return "bg-green-400"
      case "failed":
        return "bg-red-400"
      default:
        return "bg-yellow-400"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate totals based on actual registration data
  const calculateTotals = () => {
    const totalRegistrations = registrations.length
    const totalParticipants = registrations.reduce((sum, reg) => {
      return sum + (reg.participant_count || reg.participants?.length || 0)
    }, 0)

    // Calculate total amount from actual registration amounts
    const totalAmount = registrations.reduce((sum, reg) => {
      // Use total_amount if available, otherwise fall back to calculating from event price
      if (reg.total_amount) {
        return sum + Number.parseFloat(reg.total_amount)
      }
      // Fallback for older registrations without total_amount
      const participantCount = reg.participant_count || reg.participants?.length || 1
      if (event?.variable_pricing) {
        try {
          const pricingTiers = JSON.parse(event.price)
          const tier = pricingTiers.find((t) => t.participant_count === participantCount)
          const price = tier
            ? Number.parseFloat(tier.price)
            : Number.parseFloat(pricingTiers[pricingTiers.length - 1]?.price || 0)
          return sum + price
        } catch {
          return sum + Number.parseFloat(event?.price || 0)
        }
      } else {
        return sum + Number.parseFloat(event?.price || 0)
      }
    }, 0)

    // Calculate confirmed amounts (only successful registrations)
    const successfulRegistrations = registrations.filter((reg) => reg.status === "successful")
    const confirmedAmount = successfulRegistrations.reduce((sum, reg) => {
      if (reg.total_amount) {
        return sum + Number.parseFloat(reg.total_amount)
      }
      // Fallback calculation for older registrations
      const participantCount = reg.participant_count || reg.participants?.length || 1
      if (event?.variable_pricing) {
        try {
          const pricingTiers = JSON.parse(event.price)
          const tier = pricingTiers.find((t) => t.participant_count === participantCount)
          const price = tier
            ? Number.parseFloat(tier.price)
            : Number.parseFloat(pricingTiers[pricingTiers.length - 1]?.price || 0)
          return sum + price
        } catch {
          return sum + Number.parseFloat(event?.price || 0)
        }
      } else {
        return sum + Number.parseFloat(event?.price || 0)
      }
    }, 0)

    const confirmedParticipants = successfulRegistrations.reduce((sum, reg) => {
      return sum + (reg.participant_count || reg.participants?.length || 0)
    }, 0)

    return {
      totalRegistrations,
      totalParticipants,
      totalAmount,
      confirmedAmount,
      successfulRegistrations: successfulRegistrations.length,
      confirmedParticipants,
    }
  }

  const totals = calculateTotals()

  // Get registration amount for display
  const getRegistrationAmount = (registration) => {
    if (registration.total_amount) {
      return Number.parseFloat(registration.total_amount)
    }
    // Fallback calculation
    const participantCount = registration.participant_count || registration.participants?.length || 1
    if (event?.variable_pricing) {
      try {
        const pricingTiers = JSON.parse(event.price)
        const tier = pricingTiers.find((t) => t.participant_count === participantCount)
        return tier
          ? Number.parseFloat(tier.price)
          : Number.parseFloat(pricingTiers[pricingTiers.length - 1]?.price || 0)
      } catch {
        return Number.parseFloat(event?.price || 0)
      }
    } else {
      return Number.parseFloat(event?.price || 0)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading registration data...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Event not found</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{event.event_name}</h1>
              <p className="text-gray-400">Registration Dashboard</p>
              {event.variable_pricing && (
                <p className="text-sm text-blue-400 mt-1">Variable Pricing: {formatVariablePricing(event)}</p>
              )}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadExcel}
            disabled={downloading || registrations.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            {downloading ? "Downloading..." : "Download Excel"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Registrations Card */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-white">{totals.totalRegistrations}</p>
                <p className="text-sm text-gray-400">{totals.successfulRegistrations} confirmed</p>
              </div>
            </div>
          </div>

          {/* Total Participants Card */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Participants</p>
                <p className="text-3xl font-bold text-white">{totals.totalParticipants}</p>
                <p className="text-sm text-gray-400">{totals.confirmedParticipants} confirmed</p>
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-white">₹{totals.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-400">₹{totals.confirmedAmount.toLocaleString()} confirmed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/30">
          <div className="p-6 border-b border-gray-700/40">
            <h2 className="text-xl font-bold text-white">Registrations</h2>
          </div>
          {registrations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No registrations yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-750/30">
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 first:border-l-0 border-l border-gray-700/20">
                      Team Name
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 border-l border-gray-700/20">
                      Registration Date
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 border-l border-gray-700/20">
                      Participants
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 border-l border-gray-700/20">
                      Amount
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 border-l border-gray-700/20">
                      Transaction ID
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 border-l border-gray-700/20">
                      Status
                    </th>
                    <th className="text-left p-4 text-gray-300 font-medium border-b border-gray-700/20 border-l border-gray-700/20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="p-4 border-b border-gray-700/10 first:border-l-0 border-l border-gray-700/10">
                        <p className="font-medium text-white">{registration.team_name}</p>
                      </td>
                      <td className="p-4 border-b border-gray-700/10 border-l border-gray-700/10">
                        <p className="text-gray-300">{formatDate(registration.created_at)}</p>
                      </td>
                      <td className="p-4 border-b border-gray-700/10 border-l border-gray-700/10">
                        <div className="space-y-1">
                          <p className="text-sm text-blue-400 font-medium mb-2">
                            {registration.participant_count || registration.participants?.length || 0} participants
                          </p>
                          {registration.participants?.map((participant, index) => (
                            <div key={index} className="text-sm">
                              <p className="text-white font-medium">{participant.name}</p>
                              <p className="text-gray-400">
                                {participant.registerNumber} • {participant.year}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-700/10 border-l border-gray-700/10">
                        <p className="text-green-400 font-semibold">
                          ₹{getRegistrationAmount(registration).toLocaleString()}
                        </p>
                      </td>
                      <td className="p-4 border-b border-gray-700/10 border-l border-gray-700/10">
                        <p className="text-gray-300 font-mono text-sm">{registration.transaction_id}</p>
                      </td>
                      <td className="p-4 border-b border-gray-700/10 border-l border-gray-700/10">
                        <div className="relative">
                          <select
                            value={registration.status}
                            onChange={(e) => updatePaymentStatus(registration.id, e.target.value)}
                            disabled={updatingStatus === registration.id}
                            className={`w-full appearance-none bg-gray-700 border border-gray-600/40 rounded-lg pl-6 pr-8 py-2 text-sm ${getStatusColor(
                              registration.status,
                            )} focus:outline-none focus:border-blue-500/60 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed`}
                          >
                            <option value="pending">Pending</option>
                            <option value="successful">Successful</option>
                            <option value="failed">Failed</option>
                          </select>
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <div className={`w-2 h-2 rounded-full ${getStatusDot(registration.status)}`}></div>
                          </div>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-700/10 border-l border-gray-700/10">
                        <button
                          onClick={() => handleViewScreenshot(registration.payment_screenshot_url)}
                          className="flex items-center gap-2 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm border border-blue-500/20"
                        >
                          <Eye className="w-4 h-4" />
                          View Screenshot
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Screenshot Modal */}
      {showScreenshotModal && selectedScreenshot && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowScreenshotModal(false)}
        >
          <div
            className="bg-gray-800 rounded-2xl max-w-4xl max-h-[90vh] overflow-auto relative border border-gray-700/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700/40">
              <h3 className="text-lg font-semibold text-white">Payment Screenshot</h3>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedScreenshot || "/placeholder.svg"}
                alt="Payment Screenshot"
                className="max-w-full max-h-[80vh] h-auto rounded-lg object-contain"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=400&width=300"
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventRegistrationDashboard
