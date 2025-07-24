import { Bell } from "lucide-react"

const DashboardHeader = ({ club, currentSection }) => {
  const getSectionTitle = () => {
    switch (currentSection) {
      case "events":
        return "Events Management"
      case "registrations":
        return "Registrations"
      case "members":
        return "Members Management"
      case "recruitment":
        return "Recruitment"
      case "analytics":
        return "Analytics"
      case "manage":
        return "Club Management"
      default:
        return "Dashboard Overview"
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{getSectionTitle()}</h1>
          <p className="text-gray-400">{club.name}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
