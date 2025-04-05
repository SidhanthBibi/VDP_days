"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import {
  Trophy,
  Calendar,
  User,
  UserPlus,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Plus,
  Globe,
  Instagram,
  Linkedin,
  CircleDollarSign,
  CircleCheck,
  Settings,
  Upload,
  Star,
  Edit,
  X,
} from "lucide-react"

const ClubDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [club, setClub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isHiring, setIsHiring] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [isCoordinator, setIsCoordinator] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [newLogoFile, setNewLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [haveAccess, setHaveAccess] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    website: "",
    instagram_url: "",
    linkedin_url: "",
    access: [],
  })

  // Add these new state variables for main events and sub-events
  const [mainEvents, setMainEvents] = useState([])
  const [showSubEventsPopup, setShowSubEventsPopup] = useState(false)
  const [selectedMainEvent, setSelectedMainEvent] = useState(null)
  const [subEvents, setSubEvents] = useState([])
  const [loadingSubEvents, setLoadingSubEvents] = useState(false)

  // State for editing main events
  const [isEditingMainEvent, setIsEditingMainEvent] = useState(false)
  const [selectedMainEventForEdit, setSelectedMainEventForEdit] = useState(null)
  const [mainEventFormData, setMainEventFormData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location: "",
    price: "",
    websiteLink: "",
    poster: "",
  })
  const [mainEventPosterFile, setMainEventPosterFile] = useState(null)
  const [mainEventPosterPreview, setMainEventPosterPreview] = useState(null)

  // State for editing sub-events
  const [isEditingSubEvent, setIsEditingSubEvent] = useState(false)
  const [selectedSubEvent, setSelectedSubEvent] = useState(null)
  const [subEventFormData, setSubEventFormData] = useState({
    event_name: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location: "",
    price: "",
    register_link: "",
    websiteLink: "",
    poster: "",
  })
  const [subEventPosterFile, setSubEventPosterFile] = useState(null)
  const [subEventPosterPreview, setSubEventPosterPreview] = useState(null)

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        navigate("/login", {
          state: {
            returnUrl: `/clubs/${id}`, // Store the current URL to redirect back after login
          },
        })
      }
    }

    checkAuth()
  }, [navigate, id])

  // Fetch current user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession()
        if (authError) throw authError

        if (session?.user?.email) {
          setCurrentUserEmail(session.user.email)
          setCurrentUserId(session.user.id)
        }
      } catch (err) {
        console.error("Error fetching user email:", err)
      }
    }

    fetchUserEmail()
  }, [])

  console.log("Hello World")
  // Check if user is following the club
  useEffect(() => {
    const checkIfFollowing = async () => {
      if (!currentUserId || !id) return

      try {
        const { data, error } = await supabase.from("profiles").select("followed").eq("id", currentUserId).single()

        if (error) throw error

        // Check if the club ID is in the followed array
        const isFollowed = data.followed ? data.followed.includes(id) : false
        setIsFollowing(isFollowed)
      } catch (err) {
        console.error("Error checking follow status:", err)
      }
    }

    checkIfFollowing()
  }, [currentUserId, id])

  const checkUserAccess = (clubData, userEmail) => {
    if (!userEmail) return false

    // Check if user is the coordinator
    if (clubData.Club_Coordinator === userEmail) {
      return true
    }

    // Check if user's email is in the access array
    if (Array.isArray(clubData.access) && clubData.access.includes(userEmail)) {
      return true
    }

    return false
  }

  const handleCopy = async () => {
    try {
      // Get the current URL
      const currentUrl = window.location.href

      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl)

      // Show success state
      setCopied(true)

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    const emailInput = document.getElementById("email-input")
    if (!emailInput || !emailInput.value) return

    // Process comma-separated emails
    const emails = emailInput.value.split(",")

    emails.forEach((email) => {
      const trimmedEmail = email.trim()
      if (trimmedEmail && isValidEmail(trimmedEmail) && !editFormData.access.includes(trimmedEmail)) {
        setEditFormData((prev) => ({
          ...prev,
          access: [...prev.access, trimmedEmail],
        }))
      }
    })

    // Clear the input
    emailInput.value = ""
  }

  // Add this function to handle logo file changes
  const handleUpdateClubDetails = async () => {
    try {
      setLoading(true)

      // First update the logo if there's a new one
      let imageUrl = club.image
      if (newLogoFile) {
        const fileExt = newLogoFile.name.split(".").pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`
        const filePath = `clubs/${fileName}`

        const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, newLogoFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("assets").getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      // Update club details
      const { error: updateError } = await supabase
        .from("Clubs")
        .update({
          name: editFormData.name,
          description: editFormData.description,
          website: editFormData.website || null,
          instagram_url: editFormData.instagram_url || null,
          linkedin_url: editFormData.linkedin_url || null,
          image: imageUrl,
          access: editFormData.access, // Use the array directly
        })
        .eq("id", club.id)

      if (updateError) throw updateError

      // Update local state
      setClub((prev) => ({
        ...prev,
        name: editFormData.name,
        description: editFormData.description,
        website: editFormData.website,
        instagram_url: editFormData.instagram_url,
        linkedin_url: editFormData.linkedin_url,
        image: imageUrl,
        access: editFormData.access,
      }))

      setIsSettingsOpen(false)
      setNewLogoFile(null)
      setLogoPreview(null)

      // Reload the page to reflect all changes
      window.location.reload()
    } catch (error) {
      console.error("Error updating club details:", error)
      alert("Failed to update club details: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (isSettingsOpen && club) {
      setEditFormData({
        name: club.name,
        description: club.description,
        website: club.website || "",
        instagram_url: club.instagram_url || "",
        linkedin_url: club.linkedin_url || "",
        access: club.access || [], // Initialize from club data
      })
    }
  }, [isSettingsOpen, club])

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // File type validation
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      setNewLogoFile(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setLogoPreview(previewUrl)
    }
  }

  // Handle follow/unfollow club
  const handleFollowToggle = async () => {
    if (!currentUserId) {
      // Redirect to login if not logged in
      navigate("/login", {
        state: {
          returnUrl: `/clubs/${id}`,
        },
      })
      return
    }

    setFollowLoading(true)

    try {
      // Get current user's followed clubs
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("followed")
        .eq("id", currentUserId)
        .single()

      if (userError) throw userError

      // Initialize followed array if it doesn't exist
      const currentFollowed = userData.followed || []
      let newFollowed
      let followersDelta

      if (isFollowing) {
        // Unfollow logic - remove club ID from followed array
        newFollowed = currentFollowed.filter((clubId) => clubId !== id)
        followersDelta = -1
      } else {
        // Follow logic - add club ID to followed array
        newFollowed = [...currentFollowed, id]
        followersDelta = 1
      }

      // Update profiles table
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({ followed: newFollowed })
        .eq("id", currentUserId)

      if (updateProfileError) throw updateProfileError

      // Get current followers count - this needs to be done with admin privileges
      // We'll use a special RPC (Remote Procedure Call) function that has higher privileges
      // This function uses Supabase's built-in RPC feature to bypass RLS
      const { data: updatedClub, error: rpcError } = await supabase.rpc("update_follower_count", {
        club_id: id,
        delta: followersDelta,
      })

      if (rpcError) {
        console.error("Error updating follower count:", rpcError)

        // Fallback approach - use a direct SQL function call
        // This uses a stored function in the database that has SECURITY DEFINER privileges
        const { data: directUpdateResult, error: directUpdateError } = await supabase
          .from("Clubs")
          .update({
            followers: supabase.raw(`GREATEST(0, COALESCE(followers, 0) ${followersDelta > 0 ? "+" : "-"} 1)`),
          })
          .eq("id", id)
          .select("followers")

        if (directUpdateError) {
          throw directUpdateError
        }

        // Update local state
        setIsFollowing(!isFollowing)

        // Update club state with new followers count from direct update
        const newFollowerCount =
          directUpdateResult?.[0]?.followers || (Number.parseInt(club.stats.followers) + followersDelta).toString()

        setClub((prevClub) => ({
          ...prevClub,
          stats: {
            ...prevClub.stats,
            followers: newFollowerCount,
          },
        }))
      } else {
        // RPC call succeeded, update local state
        setIsFollowing(!isFollowing)

        // Get the new follower count from the RPC response or calculate it
        const newFollowerCount =
          updatedClub?.followers || (Number.parseInt(club.stats.followers) + followersDelta).toString()

        // Update club state with new followers count
        setClub((prevClub) => ({
          ...prevClub,
          stats: {
            ...prevClub.stats,
            followers: newFollowerCount,
          },
        }))
      }
    } catch (err) {
      console.error("Error following/unfollowing club:", err)

      // Even if updating the database failed, we should still update the local state
      // This ensures the UI remains responsive even if the server update failed
      const optimisticFollowerCount = isFollowing
        ? Math.max(0, Number.parseInt(club.stats.followers) - 1)
        : Number.parseInt(club.stats.followers) + 1

      setIsFollowing(!isFollowing)
      setClub((prevClub) => ({
        ...prevClub,
        stats: {
          ...prevClub.stats,
          followers: optimisticFollowerCount.toString(),
        },
      }))

      // Notify the user that there might be a sync issue
      console.log("Local state updated but server sync may have failed. Changes might not persist on reload.")
    } finally {
      setFollowLoading(false)
    }
  }

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const { data: clubData, error: clubError } = await supabase.from("Clubs").select("*").eq("id", id).single()

        if (clubError) throw clubError

        // Transform club data
        const transformedClub = {
          id: clubData.id,
          name: clubData.name,
          category: clubData.dept || "Uncategorized",
          image: clubData.image,
          description: clubData.description,
          achievements: clubData.achievements || "No achievements yet",
          memberCount: clubData.member || 0,
          stats: {
            events: "0", // Will be updated with main events count
            members: clubData.member?.toString() || "0",
            followers: clubData.followers?.toString() || "0",
          },
          contactEmail: clubData.email || "No email provided",
          instagram_url: clubData.instagram_url,
          linkedin_url: clubData.linkedin_url,
          website: clubData.website,
          Club_Coordinator: clubData.Club_Coordinator,
          access: clubData.access || [], // Ensure access is always an array
        }

        setClub(transformedClub)

        // Check access based on coordinator email AND access array
        if (currentUserEmail) {
          // Check if current user is the coordinator
          const isUserCoordinator = clubData.Club_Coordinator === currentUserEmail
          setIsCoordinator(isUserCoordinator)

          // Set haveAccess flag - this will be true for both coordinators and users in access array
          const hasAccess = checkUserAccess(clubData, currentUserEmail)
          setHaveAccess(hasAccess)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id && currentUserEmail) {
      fetchClubDetails()
    }
  }, [id, currentUserEmail])

  // Add this function after the existing useEffect hooks
  useEffect(() => {
    const fetchMainEvents = async () => {
      if (!club) return

      try {
        const { data, error } = await supabase.from("MainEvents").select("*").eq("club_name", club.name)

        if (error) throw error

        setMainEvents(data || [])

        // Update the events count in club stats
        if (club && data) {
          setClub((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              events: data.length.toString(),
            },
          }))
        }
      } catch (err) {
        console.error("Error fetching main events:", err)
      }
    }

    if (club) {
      fetchMainEvents()
    }
  }, [club])

  // Add this function to handle main event click
  const handleMainEventClick = async (event) => {
    setSelectedMainEvent(event)
    setLoadingSubEvents(true)

    try {
      const { data, error } = await supabase.from("SubEvents").select("*").eq("main_event_id", event.id)

      if (error) throw error

      setSubEvents(data || [])
      setShowSubEventsPopup(true)
    } catch (err) {
      console.error("Error fetching sub-events:", err)
    } finally {
      setLoadingSubEvents(false)
    }
  }

  // Handle editing a main event
  const handleEditMainEvent = (event, e) => {
    e.stopPropagation(); // Prevent triggering the main event click
    setSelectedMainEventForEdit(event);
    
    // Initialize form with all event properties, handling null/undefined values
    setMainEventFormData({
      event_name: event.event_name || "",
      description: event.description || "",
      start_date: event.start_date || "",
      start_time: event.start_time || "",
      end_date: event.end_date || "",
      end_time: event.end_time || "",
      location: event.location || "",
      price: event.price || "",
      websiteLink: event.websiteLink || "",
      poster: event.poster || ""
    });
    
    // Set poster preview if exists
    if (event.poster) {
      setMainEventPosterPreview(event.poster);
    } else {
      setMainEventPosterPreview(null);
    }
    
    setIsEditingMainEvent(true);
  };

  // Handle main event form input changes
  const handleMainEventInputChange = (e) => {
    const { name, value } = e.target
    setMainEventFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle main event poster file change
  const handleMainEventPosterChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // File type validation
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      setMainEventPosterFile(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setMainEventPosterPreview(previewUrl)
    }
  }

  // Update main event details
  const handleUpdateMainEvent = async () => {
    if (!selectedMainEventForEdit) return;
  
    try {
      setLoading(true);
  
      // First update the poster if there's a new one
      let posterUrl = selectedMainEventForEdit.poster;
      if (mainEventPosterFile) {
        const fileExt = mainEventPosterFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `main-events/${fileName}`;
  
        const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, mainEventPosterFile);
  
        if (uploadError) throw uploadError;
  
        const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
  
        posterUrl = data.publicUrl;
      }
  
      // Prepare update data with proper handling of empty values
      const updateData = {
        event_name: mainEventFormData.event_name,
        description: mainEventFormData.description || "",
        // Ensure date/time fields use proper format
        start_date: mainEventFormData.start_date || null,
        start_time: mainEventFormData.start_time || null,
        end_date: mainEventFormData.end_date || null,
        end_time: mainEventFormData.end_time || null,
        location: mainEventFormData.location || "",
        price: mainEventFormData.price || "Free",
        websiteLink: mainEventFormData.websiteLink || "",
        poster: posterUrl
      };
  
      console.log("Updating main event with data:", updateData);
  
      // Update main event details
      const { data: updatedEvent, error: updateError } = await supabase
        .from("MainEvents")
        .update(updateData)
        .eq("id", selectedMainEventForEdit.id)
        .select();
  
      if (updateError) throw updateError;
  
      console.log("Update response:", updatedEvent);
  
      // Update local state
      const updatedMainEvents = mainEvents.map((event) => {
        if (event.id === selectedMainEventForEdit.id) {
          return {
            ...event,
            ...updateData
          };
        }
        return event;
      });
  
      setMainEvents(updatedMainEvents);
      setIsEditingMainEvent(false);
      setSelectedMainEventForEdit(null);
      setMainEventPosterFile(null);
      setMainEventPosterPreview(null);
  
      // Show success message
      alert("Main event updated successfully!");
    } catch (error) {
      console.error("Error updating main event:", error);
      alert("Failed to update main event: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a sub-event
  const handleEditSubEvent = (event, e) => {
    e.stopPropagation(); // Prevent triggering any parent click events
    setSelectedSubEvent(event);
    
    // Initialize form with all event properties, handling null/undefined values
    setSubEventFormData({
      event_name: event.event_name || "",
      description: event.description || "",
      start_date: event.start_date || "",
      start_time: event.start_time || "",
      end_date: event.end_date || "",
      end_time: event.end_time || "",
      location: event.location || "",
      price: event.price || "",
      register_link: event.register_link || "",
      websiteLink: event.websiteLink || "",
      poster: event.poster || ""
    });
    
    // Set poster preview if exists
    if (event.poster) {
      setSubEventPosterPreview(event.poster);
    } else {
      setSubEventPosterPreview(null);
    }
    
    setIsEditingSubEvent(true);
  };

  // Handle sub-event form input changes
  const handleSubEventInputChange = (e) => {
    const { name, value } = e.target
    setSubEventFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle sub-event poster file change
  const handleSubEventPosterChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // File type validation
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      setSubEventPosterFile(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setSubEventPosterPreview(previewUrl)
    }
  }

  // Update sub-event details
  const handleUpdateSubEvent = async () => {
    if (!selectedSubEvent) return;
  
    try {
      setLoading(true);
  
      // First update the poster if there's a new one
      let posterUrl = selectedSubEvent.poster;
      if (subEventPosterFile) {
        const fileExt = subEventPosterFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `sub-events/${fileName}`;
  
        const { error: uploadError } = await supabase.storage.from("assets").upload(filePath, subEventPosterFile);
  
        if (uploadError) throw uploadError;
  
        const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
  
        posterUrl = data.publicUrl;
      }
  
      // Prepare update data with proper handling of empty values
      const updateData = {
        event_name: subEventFormData.event_name,
        description: subEventFormData.description || "",
        // Ensure date/time fields use proper format
        start_date: subEventFormData.start_date || null,
        start_time: subEventFormData.start_time || null,
        end_date: subEventFormData.end_date || null,
        end_time: subEventFormData.end_time || null,
        location: subEventFormData.location || "",
        price: subEventFormData.price || "Free",
        register_link: subEventFormData.register_link || "",
        websiteLink: subEventFormData.websiteLink || "",
        poster: posterUrl,
        // IMPORTANT: Ensure main_event_id is preserved
        main_event_id: selectedSubEvent.main_event_id
      };
  
      console.log("Updating sub-event with data:", updateData);
  
      // Update sub-event details
      const { data: updatedEvent, error: updateError } = await supabase
        .from("SubEvents")
        .update(updateData)
        .eq("id", selectedSubEvent.id)
        .select();
  
      if (updateError) throw updateError;
  
      console.log("Update response:", updatedEvent);
  
      // Update local state
      const updatedSubEvents = subEvents.map((event) => {
        if (event.id === selectedSubEvent.id) {
          return {
            ...event,
            ...updateData
          };
        }
        return event;
      });
  
      setSubEvents(updatedSubEvents);
      setIsEditingSubEvent(false);
      setSelectedSubEvent(null);
      setSubEventPosterFile(null);
      setSubEventPosterPreview(null);
  
      // Show success message
      alert("Sub-event updated successfully!");
    } catch (error) {
      console.error("Error updating sub-event:", error);
      alert("Failed to update sub-event: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading club details...</p>
        </div>
      </div>
    )
  }

  if (error || !club) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Club not found</h1>
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
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-72 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <button
          onClick={() => navigate("/clubs")}
          className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black/30 px-4 py-2 rounded-lg hover:bg-black/40 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Club Logo and Basic Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-gray-800 rounded-2xl shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-32 h-32 rounded-2xl bg-blue-500 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                {club.image ? (
                  <img
                    src={club.image || "/placeholder.svg"}
                    alt={`${club.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{club.name.charAt(0)}</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-white">{club.name}</h1>
                  <span className="px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">{club.category}</span>
                </div>
                <p className="text-gray-400 mb-4">{club.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Trophy className="h-5 w-5" />
                    <span>{club.achievements}</span>
                  </div>
                </div>
              </div>

              {/* Reorganized button section */}
              <div className="flex flex-col gap-3 sm:items-end">
                {/* Primary actions */}
                <div className="flex flex-wrap gap-2">
                  {/* Join button */}
                  {isCoordinator || haveAccess ? (
                    <button className="border border-gray-600 text-gray-400 px-4 py-2 rounded-xl transition-colors">
                      Join Club
                    </button>
                  ) : isHiring ? (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
                      Join Club
                    </button>
                  ) : (
                    <button className="border border-gray-600 text-white px-4 py-2 rounded-xl transition-colors">
                      Not Hiring
                    </button>
                  )}

                  {/* Follow button */}
                  <button
                    onClick={handleFollowToggle}
                    className={`${
                      isFollowing ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-700 hover:bg-gray-600"
                    } text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 relative`}
                    disabled={followLoading}
                  >
                    {followLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Star className={`w-5 h-5 ${isFollowing ? "fill-white" : ""}`} />
                        <span>{isFollowing ? "Following" : "Follow"}</span>
                      </>
                    )}
                  </button>

                  {/* Share button - MOBILE ONLY VERSION */}
                  <button
                    onClick={handleCopy}
                    className="flex sm:hidden items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-xl transition-colors"
                  >
                    {copied ? (
                      <>
                        <CircleCheck className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary actions */}
                <div className="flex gap-2 mt-2">
                  {/* Create event button - only for coordinators/admins */}
                  {(isCoordinator || haveAccess) && (
                    <a
                      href="/create-main-event"
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Main Event</span>
                    </a>
                  )}

                  {/* Share button - DESKTOP ONLY VERSION */}
                  <button
                    onClick={handleCopy}
                    className="hidden sm:flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-xl transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <CircleCheck className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {/* Settings button - only for coordinators/admins */}
                  {(isCoordinator || haveAccess) && (
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="bg-gray-700 hover:bg-gray-600 flex items-center gap-2 text-white px-3 py-2 rounded-xl transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-700">
            <div className="grid grid-cols-3 divide-x divide-gray-700">
              <div className="p-6 text-center">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">{club.stats.events}+</p>
                <p className="text-sm text-gray-400">Events</p>
              </div>
              <div className="p-6 text-center">
                <User className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">{club.stats.members}+</p>
                <p className="text-sm text-gray-400">Members</p>
              </div>
              <div className="p-6 text-center">
                <UserPlus className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">{club.stats.followers}</p>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
            </div>
          </div>
        </div>
        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* About Section */}
          <div className="md:col-span-2 bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-400">{club.description}</p>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Club Info</h2>
            <div className="space-y-4">
              {club.website && (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                </a>
              )}
              {club.instagram_url && (
                <a
                  href={club.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
              )}
              {club.linkedin_url && (
                <a
                  href={club.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Events Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mt-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Main Events</h2>
            {(isCoordinator || haveAccess) && (
              <a href="/create-main-event">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Main Event</span>
                </button>
              </a>
            )}
          </div>

          {mainEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No main events hosted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative bg-gray-700/50 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => handleMainEventClick(event)}
                >
                  {/* Event Image */}
                  <div className="aspect-[3/4] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 z-10"></div>
                    <img
                      src={event.poster || "/placeholder.svg"}
                      alt={event.event_name}
                      className="w-full h-full object-cover"
                    />

                    {/* Edit Button - Only visible for coordinators/access users */}
                    {(isCoordinator || haveAccess) && (
                      <div className="absolute top-4 right-4 z-30 flex gap-2">
                        <button
                          onClick={(e) => handleEditMainEvent(event, e)}
                          className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{event.event_name}</h3>
                        <p className="text-gray-300 line-clamp-3 mb-4">{event.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {event.start_date ? new Date(event.start_date).toLocaleDateString() : "Date TBA"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location || "Location TBA"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-sm self-end">
                        Click to view sub-events
                      </div>
                    </div>
                  </div>

                  {/* Title visible without hover */}
                  <div className="flex flex-col justify-end absolute h-30 bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-semibold text-white truncate">{event.event_name}</h3>
                    <p className="text-gray-300 text-sm">
                      {event.start_date ? new Date(event.start_date).toLocaleDateString() : "Date TBA"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Club Settings</h2>

            {/* Logo Update Section */}
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium mb-2">Update Club Logo</label>
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-700 mb-4">
                {logoPreview || club.image ? (
                  <img src={logoPreview || club.image} alt="Logo preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {club.name.charAt(0)}
                  </div>
                )}

                {/* Upload overlay */}
                <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <span className="text-sm text-white">Upload new logo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                </label>
              </div>
            </div>

            {/* Club Details Form */}
            <div className="space-y-4">
              {/* Club Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Club Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">About Club</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                  rows={4}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={editFormData.website}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              {/* Instagram URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
                <input
                  type="url"
                  name="instagram_url"
                  value={editFormData.instagram_url}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={editFormData.linkedin_url}
                  onChange={handleEditInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Share Access</label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    id="email-input"
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Display the email chips here */}
                {editFormData.access && editFormData.access.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-300 mb-2">Access shared with:</p>
                    <div className="flex flex-wrap gap-2">
                      {editFormData.access.map((email, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center"
                        >
                          <span className="mr-2">{email}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newAccess = [...editFormData.access]
                              newAccess.splice(index, 1)
                              setEditFormData((prev) => ({
                                ...prev,
                                access: newAccess,
                              }))
                            }}
                            className="text-blue-300 hover:text-red-400"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateClubDetails}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Main Event Modal */}
      {isEditingMainEvent && selectedMainEventForEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                setIsEditingMainEvent(false)
                setSelectedMainEventForEdit(null)
                setMainEventPosterFile(null)
                setMainEventPosterPreview(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Edit Main Event</h2>

            {/* Main Event Poster Update Section */}
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium mb-2">Event Poster</label>
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-700 mb-4">
                {mainEventPosterPreview ? (
                  <img
                    src={mainEventPosterPreview || "/placeholder.svg"}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    No Image
                  </div>
                )}

                {/* Upload overlay */}
                <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <span className="text-sm text-white">Upload new poster</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleMainEventPosterChange} />
                </label>
              </div>
            </div>

            {/* Main Event Details Form */}
            <div className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={mainEventFormData.event_name}
                  onChange={handleMainEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={mainEventFormData.description}
                  onChange={handleMainEventInputChange}
                  rows={4}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Start Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={mainEventFormData.start_date}
                    onChange={handleMainEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={mainEventFormData.start_time}
                    onChange={handleMainEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* End Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={mainEventFormData.end_date}
                    onChange={handleMainEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={mainEventFormData.end_time}
                    onChange={handleMainEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={mainEventFormData.location}
                  onChange={handleMainEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <input
                  type="text"
                  name="price"
                  value={mainEventFormData.price}
                  onChange={handleMainEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Free"
                />
              </div>

              {/* Website Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website Link</label>
                <input
                  type="url"
                  name="websiteLink"
                  value={mainEventFormData.websiteLink}
                  onChange={handleMainEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsEditingMainEvent(false)
                  setSelectedMainEventForEdit(null)
                  setMainEventPosterFile(null)
                  setMainEventPosterPreview(null)
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMainEvent}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub-Event Modal */}
      {isEditingSubEvent && selectedSubEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                setIsEditingSubEvent(false)
                setSelectedSubEvent(null)
                setSubEventPosterFile(null)
                setSubEventPosterPreview(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Edit Sub-Event</h2>

            {/* Sub-Event Poster Update Section */}
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium mb-2">Event Poster</label>
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-700 mb-4">
                {subEventPosterPreview ? (
                  <img
                    src={subEventPosterPreview || "/placeholder.svg"}
                    alt="Poster preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    No Image
                  </div>
                )}

                {/* Upload overlay */}
                <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <span className="text-sm text-white">Upload new poster</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleSubEventPosterChange} />
                </label>
              </div>
            </div>

            {/* Sub-Event Details Form */}
            <div className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                <input
                  type="text"
                  name="event_name"
                  value={subEventFormData.event_name}
                  onChange={handleSubEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={subEventFormData.description}
                  onChange={handleSubEventInputChange}
                  rows={4}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {/* Start Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={subEventFormData.start_date}
                    onChange={handleSubEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={subEventFormData.start_time}
                    onChange={handleSubEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* End Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={subEventFormData.end_date}
                    onChange={handleSubEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={subEventFormData.end_time}
                    onChange={handleSubEventInputChange}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={subEventFormData.location}
                  onChange={handleSubEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                <input
                  type="text"
                  name="price"
                  value={subEventFormData.price}
                  onChange={handleSubEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Free"
                />
              </div>

              {/* Register Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Register Link</label>
                <input
                  type="url"
                  name="register_link"
                  value={subEventFormData.register_link}
                  onChange={handleSubEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>

              {/* Website Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website Link</label>
                <input
                  type="url"
                  name="websiteLink"
                  value={subEventFormData.websiteLink}
                  onChange={handleSubEventInputChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  setIsEditingSubEvent(false)
                  setSelectedSubEvent(null)
                  setSubEventPosterFile(null)
                  setSubEventPosterPreview(null)
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubEvent}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Events Popup */}
      {showSubEventsPopup && selectedMainEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">{selectedMainEvent.event_name}</h2>
                <p className="text-blue-400">Sub-Events</p>
              </div>
              <button
                onClick={() => setShowSubEventsPopup(false)}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingSubEvents ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : subEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No sub-events found for this main event</p>
                  {(isCoordinator || haveAccess) && (
                    <a
                      href={`/create-sub-event/${selectedMainEvent.id}`}
                      className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Sub-Event
                    </a>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subEvents.map((event) => (
                    <div key={event.id} className="group relative bg-gray-700/50 rounded-xl overflow-hidden">
                      {/* Event Image */}
                      <div className="aspect-[3/4] relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 z-10"></div>
                        <img
                          src={event.poster || "/placeholder.svg"}
                          alt={event.event_name}
                          className="w-full h-full object-cover"
                        />

                        {/* Edit Button - Only visible for coordinators/access users */}
                        {(isCoordinator || haveAccess) && (
                          <div className="absolute top-4 right-4 z-30 flex gap-2">
                            <button
                              onClick={(e) => handleEditSubEvent(event, e)}
                              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <Edit className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{event.event_name}</h3>
                            <p className="text-gray-300 line-clamp-3 mb-4">{event.description}</p>

                            <div className="space-y-2">
                              <div className="flex items-center text-gray-300">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>
                                  {event.start_date ? new Date(event.start_date).toLocaleDateString() : "Date TBA"}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-300">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{event.start_time || "Time TBA"}</span>
                              </div>
                              {event.end_date && (
                                <div className="flex items-center text-gray-300">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  <span>End: {new Date(event.end_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {event.end_time && (
                                <div className="flex items-center text-gray-300">
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span>End: {event.end_time}</span>
                                </div>
                              )}
                              <div className="flex items-center text-gray-300">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{event.location || "Location TBA"}</span>
                              </div>
                              <div className="flex items-center text-gray-300">
                                <CircleDollarSign className="w-4 h-4 mr-2" />
                                <span>{event.price || "Free"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mt-4">
                            {event.register_link && (
                              <a
                                href={event.register_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                              >
                                Register
                              </a>
                            )}
                            {event.websiteLink && (
                              <a
                                href={event.websiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                              >
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Title visible without hover */}
                      <div className="flex flex-col justify-end absolute h-30 bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-lg font-semibold text-white truncate">{event.event_name}</h3>
                        <p className="text-gray-300 text-sm">
                          {event.start_date ? new Date(event.start_date).toLocaleDateString() : "Date TBA"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-800 p-6 border-t border-gray-700 flex justify-between items-center z-10">
              {(isCoordinator || haveAccess) && (
                <a
                  href={`/create-sub-event/${selectedMainEvent.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Sub-Event</span>
                </a>
              )}
              <button
                onClick={() => setShowSubEventsPopup(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ClubDetail

