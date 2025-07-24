"use client"

import { Link, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  UsersRound,
} from "lucide-react"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

const ClubSidebar = ({ club, currentSection, clubId }) => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: `/dashboard/${clubId}`,
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      path: `/dashboard/${clubId}/events`,
    },
    {
      id: "registrations",
      label: "Registrations",
      icon: Users,
      path: `/dashboard/${clubId}/registrations`,
    },
    {
      id: "members",
      label: "Members",
      icon: UsersRound,
      path: `/dashboard/${clubId}/members`,
    },
    {
      id: "recruitment",
      label: "Recruitment",
      icon: UserPlus,
      path: `/dashboard/${clubId}/recruitment`,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: `/dashboard/${clubId}/analytics`,
    },
    {
      id: "manage",
      label: "Manage",
      icon: Settings,
      path: `/dashboard/${clubId}/manage`,
    },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const SidebarContent = () => (
    <>
      {/* Club Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center overflow-hidden">
            {club.image ? (
              <img
                src={club.image || "/placeholder.svg"}
                alt={`${club.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">{club.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-white truncate">{club.name}</h2>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentSection === item.id

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 bg-gray-800 p-2 rounded-lg text-white"
        style={{ top: "80px" }} // Position below the navbar
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 pt-16" onClick={() => setIsMobileMenuOpen(false)}>
          {/* pt-16 to account for navbar */}
          <div className="w-64 h-full bg-gray-800 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-4">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:top-16 lg:bottom-0 lg:w-64 lg:flex-col lg:bg-gray-800 lg:border-r lg:border-gray-700">
        {/* lg:top-16 to position below the navbar */}
        <SidebarContent />
      </div>
    </>
  )
}

export default ClubSidebar
