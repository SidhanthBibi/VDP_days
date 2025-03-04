import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
  Users,
  Trophy,
  Calendar,
  User,
  UserPlus,
  Clock,
  MapPin,
  Mail,
  ArrowLeft,
  Share2,
  Heart,
  Plus,
  Globe,
  Instagram,
  Linkedin,
  CircleDollarSign,
  Check,
  CircleCheck,
  Settings,
  Upload,
} from "lucide-react";

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clubEvents, setClubEvents] = useState([]);
  const [isHiring, setIsHiring] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newLogoFile, setNewLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [haveAccess, setHaveAccess] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    website: "",
    instagram_url: "",
    linkedin_url: "",
    access: [],
  });

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        navigate("/login", {
          state: {
            returnUrl: `/clubs/${id}`, // Store the current URL to redirect back after login
          },
        });
      }
    };

    checkAuth();
  }, [navigate, id]);

  // Fetch current user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();
        if (authError) throw authError;

        if (session?.user?.email) {
          setCurrentUserEmail(session.user.email);
        }
      } catch (err) {
        console.error("Error fetching user email:", err);
      }
    };

    fetchUserEmail();
  }, []);

  const checkUserAccess = (clubData, userEmail) => {
    if (!userEmail) return false;

    // Check if user is the coordinator
    if (clubData.Club_Coordinator === userEmail) {
      return true;
    }

    // Check if user's email is in the access array
    if (Array.isArray(clubData.access) && clubData.access.includes(userEmail)) {
      return true;
    }

    return false;
  };

  const handleCopy = async () => {
    try {
      // Get the current URL
      const currentUrl = window.location.href;

      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl);

      // Show success state
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const emailInput = document.getElementById("email-input");
    if (!emailInput || !emailInput.value) return;

    // Process comma-separated emails
    const emails = emailInput.value.split(",");

    emails.forEach((email) => {
      const trimmedEmail = email.trim();
      if (
        trimmedEmail &&
        isValidEmail(trimmedEmail) &&
        !editFormData.access.includes(trimmedEmail)
      ) {
        setEditFormData((prev) => ({
          ...prev,
          access: [...prev.access, trimmedEmail],
        }));
      }
    });

    // Clear the input
    emailInput.value = "";
  };

  // Add this function to handle logo file changes
  const handleUpdateClubDetails = async () => {
    try {
      setLoading(true);

      // First update the logo if there's a new one
      let imageUrl = club.image;
      if (newLogoFile) {
        const fileExt = newLogoFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}.${fileExt}`;
        const filePath = `clubs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, newLogoFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("assets").getPublicUrl(filePath);

        imageUrl = data.publicUrl;
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
        .eq("id", club.id);

      if (updateError) throw updateError;

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
      }));

      setIsSettingsOpen(false);
      setNewLogoFile(null);
      setLogoPreview(null);

      // Reload the page to reflect all changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating club details:", error);
      alert("Failed to update club details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isSettingsOpen && club) {
      setEditFormData({
        name: club.name,
        description: club.description,
        website: club.website || "",
        instagram_url: club.instagram_url || "",
        linkedin_url: club.linkedin_url || "",
        access: club.access || [], // Initialize from club data
      });
    }
  }, [isSettingsOpen, club]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // File type validation
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      setNewLogoFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };
  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const { data: clubData, error: clubError } = await supabase
          .from("Clubs")
          .select("*")
          .eq("id", id)
          .single();
  
        if (clubError) throw clubError;
  
        // Fetch events for this club
        const { data: eventsData, error: eventsError } = await supabase
          .from("Events")
          .select("*")
          .eq("club_name", clubData.name);
  
        if (eventsError) throw eventsError;
  
        // Set clubEvents state
        setClubEvents(eventsData || []);
        
        // Get the dynamic count of events
        const eventCount = eventsData ? eventsData.length : 0;
  
        // Transform club data with dynamic event count
        const transformedClub = {
          id: clubData.id,
          name: clubData.name,
          category: clubData.dept || "Uncategorized",
          image: clubData.image,
          description: clubData.description,
          achievements: clubData.achievements || "No achievements yet",
          memberCount: clubData.member || 0,
          stats: {
            events: eventCount.toString(), // Use the actual count from eventsData
            members: clubData.member?.toString() || "0",
            followers: clubData.followers?.toString() || "0",
          },
          contactEmail: clubData.email || "No email provided",
          instagram_url: clubData.instagram_url,
          linkedin_url: clubData.linkedin_url,
          website: clubData.website,
          Club_Coordinator: clubData.Club_Coordinator,
          access: clubData.access || [], // Ensure access is always an array
        };
  
        setClub(transformedClub);
  
        // Check access based on coordinator email AND access array
        if (currentUserEmail) {
          // Check if current user is the coordinator
          const isUserCoordinator =
            clubData.Club_Coordinator === currentUserEmail;
          setIsCoordinator(isUserCoordinator);
  
          // Set haveAccess flag - this will be true for both coordinators and users in access array
          const hasAccess = checkUserAccess(clubData, currentUserEmail);
          setHaveAccess(hasAccess);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (id && currentUserEmail) {
      fetchClubDetails();
    }
  }, [id, currentUserEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading club details...</p>
        </div>
      </div>
    );
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
    );
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
                    src={club.image}
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
                  <span className="px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                    {club.category}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{club.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Trophy className="h-5 w-5" />
                    <span>{club.achievements}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-5 w-5" />
                    <span>{club.memberCount} members</span>
                  </div> */}
                </div>
              </div>

              <div className="flex gap-3">
                {(isCoordinator || haveAccess) ? (
                  <button className="border-1 border-gray-600 text-gray-400 px-6 py-2 rounded-xl transition-colors">
                    Join Club
                  </button>
                ) : isHiring ? (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors">
                    Join Club
                  </button>
                ) : (
                  <button className="border-1 border-gray-600 text-white px-6 py-2 rounded-xl transition-colors">
                    Not Hiring
                  </button>
                )}

                {(isCoordinator || haveAccess) && (
                  <a href="/create_event">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors">
                      <Plus className="w-5 h-6" />
                    </button>
                  </a>
                )}
                <button
                  onClick={handleCopy}
                  className="bg-gray-700 hover:bg-gray-600 flex justify-center items-center gap-1 text-white p-2 rounded-xl transition-colors"
                >
                  {copied ? (
                    <>
                      <span>
                        <CircleCheck className="w-5 h-5" />
                      </span>
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                    </>
                  )}
                </button>

                {(isCoordinator || haveAccess) && (
                  <>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors"
                    >
                      <Settings className="w-5 h-6" />
                    </button>

                    {/* Settings Modal */}
                    {isSettingsOpen && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-2xl w-full max-w-lg mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
                          {/* Close button */}
                          <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>

                          <h2 className="text-2xl font-bold text-center mb-6">
                            Club Settings
                          </h2>

                          {/* Logo Update Section */}
                          <div className="flex flex-col items-center mb-6">
                            <label className="block text-sm font-medium mb-2">
                              Update Club Logo
                            </label>
                            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-700 mb-4">
                              {logoPreview || club.image ? (
                                <img
                                  src={logoPreview || club.image}
                                  alt="Logo preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                  {club.name.charAt(0)}
                                </div>
                              )}

                              {/* Upload overlay */}
                              <label className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                <Upload className="w-8 h-8 text-white mb-2" />
                                <span className="text-sm text-white">
                                  Upload new logo
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleLogoChange}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Club Details Form */}
                          <div className="space-y-4">
                            {/* Club Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Club Name
                              </label>
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
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                About Club
                              </label>
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
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Website URL
                              </label>
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
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Instagram URL
                              </label>
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
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                LinkedIn URL
                              </label>
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
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Share Access
                              </label>
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
                              {editFormData.access &&
                                editFormData.access.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm text-gray-300 mb-2">
                                      Access shared with:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {editFormData.access.map(
                                        (email, index) => (
                                          <div
                                            key={index}
                                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center"
                                          >
                                            <span className="mr-2">
                                              {email}
                                            </span>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newAccess = [
                                                  ...editFormData.access,
                                                ];
                                                newAccess.splice(index, 1);
                                                setEditFormData((prev) => ({
                                                  ...prev,
                                                  access: newAccess,
                                                }));
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
                                        )
                                      )}
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
                  </>
                )}

                {/*like button code*/}
                {/* <button
                  // onClick={handleLikeClick}
                  className={`${
                    isLiked
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  } text-white p-2 rounded-xl transition-colors relative group`}
                  disabled={loading}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {loading && (
                    <div className="border absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button> */}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-700">
            <div className="grid grid-cols-3 divide-x divide-gray-700">
              <div className="p-6 text-center">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">
                  {club.stats.events}+
                </p>
                <p className="text-sm text-gray-400">Events</p>
              </div>
              <div className="p-6 text-center">
                <User className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">
                  {club.stats.members}+
                </p>
                <p className="text-sm text-gray-400">Members</p>
              </div>
              <div className="p-6 text-center">
                <UserPlus className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">
                  {club.stats.followers}+
                </p>
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

        {/* Events Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mt-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Events Hosted</h2>

          {clubEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No events hosted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative bg-gray-700/50 rounded-xl overflow-hidden"
                >
                  {/* Event Image */}
                  <div className="aspect-[3/4] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60 z-10"></div>
                    <img
                      src={event.poster}
                      alt={event.event_name}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {event.event_name}
                        </h3>
                        <p className="text-gray-300 line-clamp-3 mb-4">
                          {event.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <CircleDollarSign className="w-4 h-4 mr-2" />
                            <span>{event.price || "Free"}</span>
                          </div>
                        </div>
                      </div>
                      {/* 
                      <a
                        href={event.register_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center px-4 py-2 rounded-lg
                          hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                          shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
                      >
                        Register Now
                      </a> */}
                    </div>
                  </div>

                  {/* Title visible without hover */}
                  <div className="flex flex-col justify-end absolute h-30 bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {event.event_name}
                    </h3>
                    <p className="text-gray-300 text-sm">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ClubDetail;
