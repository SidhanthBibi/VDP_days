import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  User,
  Globe,
  ArrowLeft,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    register_link: "",
    websiteLink: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  // Check authentication and permissions
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        toast.error("Please log in to edit events");
        navigate("/login", {
          state: {
            returnUrl: `/edit-event/${id}`,
          },
        });
        return;
      }

      setCurrentUserEmail(session.user.email);
    };

    checkAuth();
  }, [navigate, id]);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setFetchLoading(true);

        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("Events")
          .select("*")
          .eq("id", id)
          .single();

        if (eventError) throw eventError;

        // Helper function to format date for input fields
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";

          // Check if date is in DD-MM-YYYY format and convert to YYYY-MM-DD for input field
          if (dateString && dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
            const [day, month, year] = dateString.split("-");
            return `${year}-${month}-${day}`;
          }

          return dateString;
        };

        // Set form data - using only the new date/time fields
        // For migrated events that still have old format data, handle them appropriately
        setFormData({
          event_name: eventData.event_name || "",
          club_name: eventData.club_name || "",
          // Use either the new fields or empty string
          start_date: formatDateForInput(eventData.start_date || ""),
          start_time: eventData.start_time || "",
          end_date: formatDateForInput(eventData.end_date || ""),
          end_time: eventData.end_time || "",
          location: eventData.location || "",
          description: eventData.description || "",
          price: eventData.price || "",
          register_link: eventData.register_link || "",
          websiteLink: eventData.websiteLink || "",
        });

        // Set image preview if available
        if (eventData.poster) {
          setPreviewUrl(eventData.poster);
        }

        // Check if current user is authorized to edit this event
        if (currentUserEmail) {
          // Fetch the club that owns this event
          const { data: clubData, error: clubError } = await supabase
            .from("Clubs")
            .select("Club_Coordinator, access")
            .eq("name", eventData.club_name)
            .single();

          if (!clubError && clubData) {
            // Check if user is coordinator or has access
            const isCoordinator =
              clubData.Club_Coordinator === currentUserEmail;
            const hasAccess =
              Array.isArray(clubData.access) &&
              clubData.access.includes(currentUserEmail);

            setCanEdit(isCoordinator || hasAccess);

            // Notify and redirect if not authorized
            if (!isCoordinator && !hasAccess) {
              toast.error("You don't have permission to edit this event");
              navigate("/clubs");
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event data");
        toast.error("Failed to load event data");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id && currentUserEmail) {
      fetchEvent();
    }
  }, [id, navigate, currentUserEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!canEdit) {
      setError("You don't have permission to edit this event");
      toast.error("You don't have permission to edit this event");
      setLoading(false);
      return;
    }

    try {
      let posterUrl = previewUrl;

      // Handle image upload if a new image is selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 7)}.${fileExt}`;
        const filePath = `events/${fileName}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage.from("assets").getPublicUrl(filePath);

        posterUrl = data.publicUrl;
      }

      // Helper function to format date for database storage
      // Update the formatDateForStorage function in your EditEventForm component:

      const formatDateForStorage = (dateString) => {
        if (!dateString) return null;

        try {
          // If date is in YYYY-MM-DD format (from the input field)
          if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Instead of manually splitting and rejoining with hyphens (which causes the error),
            // use proper date object parsing and formatting:
            const dateParts = dateString.split("-");
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // JS months are 0-based
            const day = parseInt(dateParts[2], 10);

            // Create a valid date object
            const date = new Date(year, month, day);

            // Format using ISO standard (YYYY-MM-DD) which is most compatible with databases
            return date.toISOString().split("T")[0];
          }

          return dateString;
        } catch (error) {
          console.error("Error formatting date:", error);
          return null;
        }
      };

      // Then, update the event with these properly formatted dates:
      const { error: updateError } = await supabase
        .from("Events")
        .update({
          event_name: formData.event_name,
          description: formData.description,
          // Only include fields that exist in the database schema
          start_date: formatDateForStorage(formData.start_date),
          start_time: formData.start_time,
          end_date: formatDateForStorage(formData.end_date),
          end_time: formData.end_time,
          location: formData.location,
          price: formData.price,
          register_link: formData.register_link,
          websiteLink: formData.websiteLink,
          poster: posterUrl,
        })
        .eq("id", id);
      if (updateError) throw updateError;

      toast.success("Event updated successfully!");

      // Navigate back to club detail page
      setTimeout(() => {
        navigate(`/clubs`); // You might want to redirect to the specific club
      }, 1500);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err.message);
      toast.error(`Error updating event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) {
      setError("You don't have permission to delete this event");
      toast.error("You don't have permission to delete this event");
      setShowDeleteModal(false);
      return;
    }

    setLoading(true);

    try {
      // First, get the full event data to access the poster URL
      const { data: eventData, error: fetchError } = await supabase
        .from("Events")
        .select("poster")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the poster from storage if it exists
      if (eventData.poster) {
        // Extract the file path from the URL
        const storageUrl = supabase.storage.from("assets").getPublicUrl("")
          .data.publicUrl;
        let filePath = null;

        // Check if the poster URL includes the storage URL and extract the path
        if (eventData.poster.startsWith(storageUrl)) {
          filePath = eventData.poster.replace(storageUrl, "");

          // Remove leading slash if present
          if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
          }

          // Delete the file from storage
          const { error: storageError } = await supabase.storage
            .from("assets")
            .remove([filePath]);

          if (storageError) {
            console.error("Failed to delete poster image:", storageError);
            // Continue with deleting the event even if image deletion fails
          }
        }
      }

      // Delete the event from the database
      const { error: deleteError } = await supabase
        .from("Events")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      toast.success("Event deleted successfully");

      setTimeout(() => {
        navigate("/clubs"); // Redirect to clubs page
      }, 1500);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.message);
      toast.error(`Error deleting event: ${err.message}`);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <ToastContainer theme="dark" />
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">No Permission</h1>
          <p className="text-xl mb-6">
            You don't have permission to edit this event.
          </p>
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
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Toast notifications */}
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

      {/* Background effects */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-3xl mx-auto relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Edit Event
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
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400 text-sm">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">
                      3:4 ratio recommended
                    </p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Club Name - Readonly */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organizing Club
              </label>
              <input
                type="text"
                name="club_name"
                value={formData.club_name}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-300 border border-gray-700 focus:outline-none cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Start Date and Time */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Start
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event End
              </label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <MapPin className="absolute left-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price
              </label>
              <User className="absolute left-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Free or price information"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Website Link */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website Link
              </label>
              <Globe className="absolute left-3 top-[calc(50%+0.5rem)] transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Register Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registration Link
              </label>
              <input
                type="url"
                name="register_link"
                value={formData.register_link}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 md:w-1/3
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                Delete Event
              </button>

              {/* Update Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  "Update Event"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl max-w-md mx-4 p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Delete Event</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEventForm;
