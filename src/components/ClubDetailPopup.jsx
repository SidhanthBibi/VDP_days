import { X, Image as ImageIcon, Video, LayoutGrid } from "lucide-react"
import { useState, useEffect } from "react"
import ArrowHackathon from '../assets/Hackforge.jpg'
import ArrowWorkshop from '../assets/Win.mp4'
import NICWorkshop from '../assets/NIC.jpg'

const MediaViewer = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-5xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
        >
          <X size={24} />
        </button>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          {item.type === 'video' ? (
            <video 
              src={item.url}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Club-specific media content
const clubMedia = {
  "Arrow Dev": [
    { 
      type: 'image', 
      url: ArrowHackathon, 
      id: 1,
      title: 'Hackathon 2024',
      category: 'event'
    },
    { 
      type: 'video', 
      url: ArrowWorkshop, 
      id: 2,
      title: 'Web Development Workshop',
      category: 'media'
    },
    { 
      type: 'image', 
      url: ArrowHackathon, 
      id: 3,
      title: 'Team Building Session',
      category: 'event'
    },
    { 
      type: 'video', 
      url: ArrowWorkshop, 
      id: 4,
      title: 'Demo Day',
      category: 'media'
    }
  ],
  "Next-gen intelligence": [
    { 
      type: 'image', 
      url: NICWorkshop, 
      id: 1,
      title: 'AI Workshop',
      category: 'event'
    },
    { 
      type: 'video', 
      url: ArrowWorkshop, 
      id: 2,
      title: 'Demo Day',
      category: 'media'
    },
    { 
      type: 'image', 
      url: NICWorkshop, 
      id: 3,
      title: 'Design Thinking Session',
      category: 'event'
    },
    { 
      type: 'image', 
      url: ArrowHackathon, 
      id: 1,
      title: 'Hackforge 2025',
      category: 'event'
    }
  ]
}

const ClubDetailPopup = ({ club, onClose }) => {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedMedia, setSelectedMedia] = useState(null)

  useEffect(() => {
    const navbar = document.querySelector('nav')
    if (navbar) {
      navbar.style.display = 'none'
    }
    
    return () => {
      if (navbar) {
        navbar.style.display = ''
      }
    }
  }, [])

  const mediaItems = clubMedia[club.name] || []

  const filteredMedia = mediaItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'image') return item.category === 'event';
    if (activeTab === 'video') return item.category === 'media';
    return false;
  });

  const handleClose = () => {
    const navbar = document.querySelector('nav')
    if (navbar) {
      navbar.style.display = ''
    }
    onClose()
  }

  return (
    <>
      {selectedMedia && (
        <MediaViewer
          item={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] relative overflow-auto custom-scrollbar">
          <button 
            onClick={handleClose} 
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white p-2"
          >
            <X size={24} />
          </button>
          
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start w-full">
                <div className="flex flex-col items-center sm:items-start">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg sm:mr-6"
                  />
                </div>

                <div className="w-full">
                  <div className="flex flex-col items-center w-full">
                    <div className="text-center mb-4">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">{club.name}</h2>
                      <p className="text-lg sm:text-xl text-gray-400">{club.category}</p>
                    </div>

                    <div className="flex justify-center space-x-12 mb-6 w-full">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{club.followers}</p>
                        <p className="text-sm text-gray-400">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{club.memberCount}</p>
                        <p className="text-sm text-gray-400">Members</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{club.stats.events}</p>
                        <p className="text-sm text-gray-400">Events</p>
                      </div>
                    </div>

                    <div className="w-full flex justify-center">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg w-2/3">
                        Follow
                      </button>
                    </div>

                    <div className="flex justify-center space-x-4 mt-6">
                      <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'all' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <LayoutGrid size={20} />
                        <span>All</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('image')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'image' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <ImageIcon size={20} />
                        <span>Events</span>
                      </button>
                      <button 
                        onClick={() => setActiveTab('video')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          activeTab === 'video' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Video size={20} />
                        <span>Media</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedMedia(item)}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-12 h-12 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <p className="text-sm text-white truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 12px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(31, 41, 55, 0.5);
              border-radius: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
              border-radius: 8px;
              border: 3px solid rgba(31, 41, 55, 0.5);
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #2563EB, #7C3AED);
            }

            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #3B82F6 rgba(31, 41, 55, 0.5);
            }
          `}</style>
        </div>
      </div>
    </>
  )
}

export default ClubDetailPopup