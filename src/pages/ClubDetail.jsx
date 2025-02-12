import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClubs } from '../context/ClubContext';
import { 
  Users, 
  Trophy, 
  Calendar, 
  Folder, 
  Award,
  Clock,
  MapPin,
  Mail,
  ArrowLeft,
  Share2,
  Heart,
  Plus
} from 'lucide-react';

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { clubs } = useClubs();

  // Find the club based on the id parameter
  const club = clubs.find(c => c.id === parseInt(id));

  // If club not found, show error or redirect
  if (!club) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Club not found</h1>
          <button
            onClick={() => navigate('/clubs')}
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
          onClick={() => navigate('/clubs')}
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
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-5 w-5" />
                    <span>{club.memberCount} members</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors">
                  Join Club
                </button>
                <button 
                  onClick={() => navigate('/create_event')}
                  className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              
            </div>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-700">
            <div className="grid grid-cols-3 divide-x divide-gray-700">
              <div className="p-6 text-center">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">{club.stats.events}</p>
                <p className="text-sm text-gray-400">Events</p>
              </div>
              <div className="p-6 text-center">
                <Folder className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">{club.stats.projects}</p>
                <p className="text-sm text-gray-400">Projects</p>
              </div>
              <div className="p-6 text-center">
                <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">{club.stats.competitions}</p>
                <p className="text-sm text-gray-400">Competitions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* About Section */}
          <div className="md:col-span-2 bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-400">{club.longDescription}</p>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Club Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>{club.meetingTimes}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>{club.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>{club.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-gray-800 rounded-2xl p-6 mt-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {club.upcomingEvents && club.upcomingEvents.map((event, index) => (
              <div key={index} className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-bold text-white mb-2">{event.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClubDetail;