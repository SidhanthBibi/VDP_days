import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Upload, User, Users, Globe, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const EventForm = () => {
  const [formData, setFormData] = useState({
    event_name: '',
    club_name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    price_individual: 0,
    register_link: '',
    websiteLink: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

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
    
    // Show loading toast
    const loadingToast = toast.loading('Creating your event...');

    try {
      let posterUrl = null;

      // Handle image upload if an image is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `events/${fileName}`;

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

      // Insert event data into the events table
      const { error: insertError } = await supabase
        .from('Events')
        .insert([{
          event_name: formData.event_name,
          club_name: formData.club_name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          price: formData.price_individual || 0,
          register_link: formData.register_link,
          websiteLink: formData.websiteLink,
          poster: posterUrl
        }]);

      if (insertError) {
        throw insertError;
      }

      // Reset form after successful submission
      setFormData({
        event_name: '',
        club_name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        price_individual: 0,
        register_link: '',
        websiteLink: ""
      });
      setImageFile(null);
      setPreviewUrl(null);

      // Show success toast
      toast.dismiss(loadingToast);
      toast.success('Event created successfully!', {
        duration: 5000,
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

    } catch (err) {
      // Show error toast
      toast.dismiss(loadingToast);
      toast.error(`Error: ${err.message}`, {
        duration: 5000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.97 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Toast Container */}
      <Toaster position="top-right" />

      {/* Animated background elements */}
      <motion.div 
        className="fixed top-20 right-20 w-64 h-64 bg-cyan-600 rounded-full blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="fixed bottom-20 left-20 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />

      <div className="max-w-xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.2
          }}
        >
          <h1 className="text-5xl font-bold text-white mb-2">
            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Event</span>
          </h1>
          <p className="text-gray-300">Fill in the details to create a new event</p>
        </motion.div>

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <motion.div 
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl"
            variants={itemVariants}
          >
            {/* Event Poster Upload - Portrait Style */}
            <motion.div 
              className="mb-8 flex flex-col items-center"
              variants={itemVariants}
            >
              <label className="text-gray-300 mb-3 block text-center text-lg">Event Poster</label>
              <motion.div 
                whileHover={{ scale: 1.02, borderColor: 'rgba(236, 72, 153, 0.7)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full max-w-xs h-96 rounded-xl border-2 border-cyan-400/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
                onClick={() => document.getElementById('image-upload').click()}
              >
                <AnimatePresence mode="wait">
                  {previewUrl ? (
                    <motion.img 
                      key="preview" 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.div 
                      key="upload" 
                      className="text-center p-4 flex flex-col items-center justify-center h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="bg-white/10 p-6 rounded-full mb-4">
                        <Upload className="w-16 h-16 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                      </div>
                      <p className="text-white text-xl font-medium mb-2">Upload Event Poster</p>
                      <p className="text-gray-300 text-sm max-w-xs text-center">
                        Select a portrait image in 3:4 ratio
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Event Title */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Event Title</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Organizing Club */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Organizing Club</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  type="text"
                  name="club_name"
                  value={formData.club_name}
                  onChange={handleChange}
                  placeholder="Enter club name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div 
                className="relative group"
                variants={itemVariants}
              >
                <label className="text-gray-300 ml-2 mb-1 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="relative group"
                variants={itemVariants}
              >
                <label className="text-gray-300 ml-2 mb-1 block">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Location */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Price */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Price Information</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  type="text"
                  name="price_individual"
                  value={formData.price_individual}
                  onChange={handleChange}
                  placeholder="Enter price details (e.g. Free, ₹100, ₹200 per team)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Website Link */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Website Link</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  type="url"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Registration Link */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Registration Link</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300" />
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  type="url"
                  name="register_link"
                  value={formData.register_link}
                  onChange={handleChange}
                  placeholder="Enter registration URL"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div 
              className="mb-6 relative group"
              variants={itemVariants}
            >
              <label className="text-gray-300 ml-2 mb-1 block">Event Description</label>
              <div className="relative">
                <div className="absolute left-3 top-3 w-5 h-5 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300">
                  <Users className="w-5 h-5" />
                </div>
                <motion.textarea
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6, 182, 212, 0.5)" }}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event"
                  rows="4"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  required
                ></motion.textarea>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 py-4 rounded-xl
                hover:from-cyan-600 hover:to-pink-600 transition-all duration-300 
                shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-pink-500/30
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Send className="w-5 h-5" /> 
                  <span>Create Event</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Decorative elements */}
        <motion.div 
          className="hidden md:block absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        <motion.div 
          className="hidden md:block absolute -top-20 -right-20 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
      </div>
    </motion.div>
  );
};

export default EventForm;