"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"
import ClubSidebar from "./ClubSidebar"
import DashboardHeader from "./DashboardHeader"

const ClubDashboardLayout = () => {
  const { clubId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUserEmail, setCurrentUserEmail] = useState(null)
  const [hasAccess, setHasAccess] = useState(false)

  // Get current section from URL
  const getCurrentSection = () => {
    const path = location.pathname
    if (path.includes("/events")) return "events"
    if (path.includes("/registrations")) return "registrations"
    if (path.includes("/members")) return "members"
    if (path.includes("/recruitment")) return "recruitment"
    if (path.includes("/analytics")) return "analytics"
    if (path.includes("/manage")) return "manage"
    return "dashboard"
  }

  const currentSection = getCurrentSection()

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        navigate("/login", {
          state: { returnUrl: `/dashboard/${clubId}` },
        })
        return
      }

      setCurrentUserEmail(session.user.email)
    }

    checkAuth()
  }, [navigate, clubId])

  // Fetch club data and check access
  useEffect(() => {
    const fetchClubData = async () => {
      if (!currentUserEmail) return

      try {
        setLoading(true)

        // Fetch club details
        const { data: clubData, error: clubError } = await supabase.from("Clubs").select("*").eq("id", clubId).single()

        if (clubError) throw clubError

        // Check if user has access
        const userHasAccess =
          clubData.Club_Coordinator === currentUserEmail ||
          (Array.isArray(clubData.access) && clubData.access.includes(currentUserEmail))

        if (!userHasAccess) {
          setError("You don't have access to this club's dashboard")
          return
        }

        setClub(clubData)
        setHasAccess(true)
      } catch (err) {
        console.error("Error fetching club data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClubData()
  }, [clubId, currentUserEmail])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !club || !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">{error || "You don't have permission to access this dashboard"}</p>
          <button
            onClick={() => navigate("/clubs")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Back to Clubs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      {/* pt-16 accounts for the fixed navbar height */}
      <div className="flex">
        {/* Sidebar */}
        <ClubSidebar club={club} currentSection={currentSection} clubId={clubId} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <DashboardHeader club={club} currentSection={currentSection} />

          {/* Dashboard Content */}
          <main className="p-6">
            <Outlet context={{ club, hasAccess, currentUserEmail }} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default ClubDashboardLayout
