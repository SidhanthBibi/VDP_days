export const formatDate = (dateString) => {
    if (!dateString) return ""
  
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }
  
  export const formatTime = (timeString) => {
    if (!timeString) return ""
  
    try {
      // Handle different time formats
      let timeParts
      if (timeString.includes(":")) {
        timeParts = timeString.split(":")
      } else {
        return timeString
      }
  
      const hours = Number.parseInt(timeParts[0], 10)
      const minutes = Number.parseInt(timeParts[1], 10)
  
      const period = hours >= 12 ? "PM" : "AM"
      const displayHours = hours % 12 || 12
  
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
    } catch (e) {
      return timeString
    }
  }
  