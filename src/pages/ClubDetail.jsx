import React from 'react';
import { Image } from 'lucide-react';

const ClubDetail = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-8">Club Details</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Club Name</label>
              <input
                type="text"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter club name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Club Logo</label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-600/50">
                  <Image className="w-8 h-8 mb-2" />
                  <span className="text-sm">Upload Logo</span>
                  <input type="file" className="hidden" accept="image/*" required />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Domain</label>
              <input
                type="text"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Tech, Arts, Sports"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter department"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input
                type="url"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Instagram profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input
                type="url"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">About Club</label>
              <textarea
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
                placeholder="Describe your club"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
            >
              Register Club
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;