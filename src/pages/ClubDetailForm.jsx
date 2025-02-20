import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ClubDetail = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    dept: '',
    instagram_url: '',
    linkedin_url: '',
    website: '',
    description: '',
    achievements: '',
    member: 0
  });
  const [logoFile, setLogoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // 1. Upload image to storage if there is one
      let imageUrl = null;
      if (logoFile) {
        // Create clubs folder if it doesn't exist
        const { data: folderData, error: folderError } = await supabase
          .storage
          .from('assets')
          .list('clubs');
          
        if (folderError && folderError.message !== 'The resource was not found') {
          throw folderError;
        }
        
        // Generate a unique file name
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `clubs/${fileName}`;
        
        // Upload file
        const { error: uploadError } = await supabase
          .storage
          .from('assets')
          .upload(filePath, logoFile, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('assets')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      // 2. Insert record into Clubs table
      const { error: insertError } = await supabase
        .from('Clubs')
        .insert({
          name: formData.name,
          image: imageUrl,
          dept: formData.dept,
          description: formData.description,
          instagram_url: formData.instagram_url || null,
          linkedin_url: formData.linkedin_url || null,
          website: formData.website || null,
          achievements: formData.achievements || null,
          member: formData.member || 0,
          followers: 0 // Default value
        });
        
      if (insertError) throw insertError;
      
      // Reset form on success
      setFormData({
        name: '',
        domain: '',
        dept: '',
        instagram_url: '',
        linkedin_url: '',
        website: '',
        description: '',
        achievements: '',
        member: 0
      });
      setLogoFile(null);
      setSuccess('Club registered successfully! Redirecting...');
      
      // Redirect to clubs page after successful submission
      setTimeout(() => {
        navigate('/clubs');
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-8">Club Details</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
              {success}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Club Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter club name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Club Logo</label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-600/50">
                  {logoFile ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover mb-2 rounded-md"
                      />
                      <span className="text-sm">{logoFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Image className="w-8 h-8 mb-2" />
                      <span className="text-sm">Upload Logo</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Domain</label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="e.g. Tech, Arts, Sports"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                name="dept"
                value={formData.dept}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter department"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Instagram profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Club website URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">About Club</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
                placeholder="Describe your club"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-24"
                placeholder="List club achievements"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Initial Members Count</label>
              <input
                type="number"
                name="member"
                value={formData.member}
                onChange={handleInputChange}
                min="0"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Number of initial members"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
                disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register Club'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;