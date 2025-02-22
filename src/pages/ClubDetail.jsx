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
} from "lucide-react";

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [clubEvents, setClubEvents] = useState([]);
  const [userType, setUserType] = useState(null);

  // Fetch user type on component mount
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        // Get current user
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();
        
        if (authError) throw authError;

        if (session?.user) {
          // Fetch user type from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", session.user.id)
            .single();
          
          console.log(profileData);
          if (profileError) throw profileError;

          setUserType(profileData?.user_type || null);
        }
      } catch (err) {
        console.error("Error fetching user type:", err);
      }
    };

    fetchUserType();
  }, []);

  const handleLikeClick = async () => {
    try {
      setLoading(true);
      const newFollowerCount = isLiked
        ? club.stats.followers - 1
        : club.stats.followers + 1;

      // Update the followers count in the database
      const { error: updateError } = await supabase
        .from("Clubs")
        .update({ followers: parseInt(newFollowerCount) })
        .eq("id", id);

      if (updateError) throw updateError;

      // Update local state
      setClub((prevClub) => ({
        ...prevClub,
        stats: {
          ...prevClub.stats,
          followers: newFollowerCount.toString(),
        },
      }));

      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error updating followers:", err);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        setLoading(true);

        // Fetch club details
        const { data: clubData, error: clubError } = await supabase
          .from("Clubs")
          .select("*")
          .eq("id", id)
          .single();

        if (clubError) throw clubError;

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
            events: "0+",
            members: clubData.member?.toString() || "0",
            followers: clubData.followers?.toString() || "0",
          },
          contactEmail: clubData.email || "No email provided",
          instagram_url: clubData.instagram_url,
          linkedin_url: clubData.linkedin_url,
          website: clubData.website,
        };

        setClub(transformedClub);

        // Fetch events for this club
        const { data: eventsData, error: eventsError } = await supabase
          .from("Events")
          .select("*")
          .eq("club_name", clubData.name);

        if (eventsError) throw eventsError;

        setClubEvents(eventsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClubDetails();
    }
  }, [id]);

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
          <p className="text-gray-400 mb-4">{error}</p>
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
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors">
                  Join Club
                </button>
                {/* {userType === "student" && ( */}
                  <a href="/create_event">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </a>
                {/* )} */}
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLikeClick}
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-700">
            <div className="grid grid-cols-3 divide-x divide-gray-700">
              <div className="p-6 text-center">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">
                  {club.stats.events}
                </p>
                <p className="text-sm text-gray-400">Events</p>
              </div>
              <div className="p-6 text-center">
                <User className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">
                  {club.stats.members}
                </p>
                <p className="text-sm text-gray-400">Members</p>
              </div>
              <div className="p-6 text-center">
                <UserPlus className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">
                  {club.stats.followers}
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
