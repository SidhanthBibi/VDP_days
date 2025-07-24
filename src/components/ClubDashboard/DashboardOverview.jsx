"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"
import { Calendar, Users, UserPlus, DollarSign, TrendingUp, TrendingDown, Plus, Eye } from "lucide-react"
import { Link } from "react-router-dom"

const DashboardOverview = () => {
  const { club } = useOutletContext()
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    totalMembers: club?.member || 0,
    recentEvents: [],
    registrationTrends: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [club])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch events for this club
      const { data: eventsData, error: eventsError } = await supabase
        .from("Events")
        .select("*")
        .eq("club_name", club.name)
        .order("created_at", { ascending: false })

      if (eventsError) throw eventsError

      // Fetch registrations for club events
      const eventIds = eventsData.map((event) => event.id)
      let registrationsData = []
      let totalRevenue = 0

      if (eventIds.length > 0) {
        const { data: regData, error: regError } = await supabase
          .from("registrations")
          .select("*")
          .in("event_id", eventIds)

        if (regError) throw regError
        registrationsData = regData || []

        // Calculate total revenue
        totalRevenue = registrationsData.reduce((sum, reg) => {
          return sum + (Number.parseFloat(reg.total_amount) || 0)
        }, 0)
      }

      setStats({
        totalEvents: eventsData.length,
        totalRegistrations: registrationsData.length,
        totalRevenue,
        totalMembers: club?.member || 0,
        recentEvents: eventsData.slice(0, 5),
        registrationTrends: registrationsData,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500/20 text-blue-400",
      green: "bg-green-500/20 text-green-400",
      purple: "bg-purple-500/20 text-purple-400",
      yellow: "bg-yellow-500/20 text-yellow-400",
    }

    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
              {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-pulse">
              <div className="w-12 h-12 bg-gray-700 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="blue"
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="Total Registrations"
          value={stats.totalRegistrations}
          icon={Users}
          color="green"
          trend="up"
          trendValue="+8.2%"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="yellow"
          trend="up"
          trendValue="+15.3%"
        />
        <StatCard
          title="Club Members"
          value={stats.totalMembers}
          icon={UserPlus}
          color="purple"
          trend="up"
          trendValue="+4.1%"
        />
      </div>

      {/* Recent Events and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Events</h2>
            <Link to={`/dashboard/${club.id}/events`} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </Link>
          </div>

          {stats.recentEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No events created yet</p>
              <Link
                to="/create_event"
                className="inline-flex items-center gap-2 mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{event.event_name}</h3>
                    <p className="text-gray-400 text-sm">
                      {event.start_date ? new Date(event.start_date).toLocaleDateString() : "Date TBA"}
                    </p>
                  </div>
                  <Link
                    to={`/event-registrations/${event.id}`}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/create_event"
              className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-white"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create New Event</span>
            </Link>

            <Link
              to={`/dashboard/${club.id}/registrations`}
              className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-white"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">View Registrations</span>
            </Link>

            <Link
              to={`/dashboard/${club.id}/analytics`}
              className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors text-white"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
