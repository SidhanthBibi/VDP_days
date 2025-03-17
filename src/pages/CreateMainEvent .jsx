import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Upload, User, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateMainEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_name: '',
    club_name: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    description: '',
    price: '',
    websiteLink: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let posterUrl = null;

      // Handle image upload if an image is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `main-events/${fileName}`;

        // Upload image to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        posterUrl = publicUrl;
      }

      // Insert main event data into the MainEvents table
      const { error: insertError, data } = await supabase
        .from('MainEvents')
        .insert([{
          event_name: formData.event_name,
          club_name: formData.club_name,
          description: formData.description,
          start_date: formData.start_date,
          start_time: formData.start_time,
          end_date: formData.end_date,
          end_time: formData.end_time,
          location: formData.location,
          price: formData.price || 'Free',
          websiteLink: formData.websiteLink,
          poster: posterUrl
        }]);

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw insertError;
      }

      // Reset form after successful submission
      setFormData({
        event_name: '',
        club_name: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        location: '',
        description: '',
        price: '',
        websiteLink: ''
      });
      setImageFile(null);
      setPreviewUrl(null);

      // Show success toast notification
      toast.success('Main event created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Navigate to main events page after short delay
      setTimeout(() => {
        navigate('/main-events');
      }, 2000);

    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'An error occurred while creating the main event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Toast Container for notifications */}
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
      
      {/* Neon Circle Accents */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-3xl mx-auto relative">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Create New Main Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            {/* Image Upload */}
            <div className="mb-8">
              <div 
                className="w-80 h-100 mx-auto rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => document.getElementById('image-upload').click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400 text-sm">Click to upload main event poster</p>
                    <p className="text-xs text-gray-500 mt-1">3:4 ratio recommended</p>
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
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleChange}
                placeholder="Main Event Title"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Club */}
            <div className="mb-6">
              <input
                type="text"
                name="club_name"
                value={formData.club_name}
                placeholder="Organizing Club"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Start Date and Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Start</label>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Event End</label>
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
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event Location"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-6 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price (e.g. 'Free', '₹100', 'Varies')"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Website Link */}
            <div className="mb-6 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
                placeholder="Website link"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event Description"
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[20px] 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Main Event...' : 'Create Main Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMainEvent;