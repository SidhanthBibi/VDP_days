import React, { useState } from 'react';
import { Calendar, Mail, Phone, Upload, User, BookOpen, GraduationCap, Send, School } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BiodataForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    isSRMVadaplani: '',
    registrationNumber: '',
    department: '',
    class: '',
    year: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Processing your request...');

    try {
      let photoUrl = null;

      // Handle photo upload if a photo is selected
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `students/${fileName}`;

        // Upload photo to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, photoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      // Insert student data into the students table
      const { error: insertError } = await supabase
        .from('Students')
        .insert([{
          id: uuidv4(),
          name: formData.name,
          gender: formData.gender,
          phone: formData.phone,
          is_srm_vadaplani: formData.isSRMVadaplani === "Yes",
          registration_number: formData.registrationNumber,
          department: formData.department,
          class: formData.class,
          year: formData.year,
          photo: photoUrl || ''
        }]);

      if (insertError) {
        throw insertError;
      }

      // Dismiss loading toast and show success toast
      toast.dismiss(loadingToast);
      toast.success('Edit request has been sent successfully!', {
        duration: 5000,
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        gender: '',
        phone: '',
        isSRMVadaplani: '',
        registrationNumber: '',
        department: '',
        class: '',
        year: '',
      });
      setPhotoFile(null);
      setPreviewUrl(null);

    } catch (err) {
      // Dismiss loading toast and show error toast
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
        staggerChildren: 0.1,
        delayChildren: 0.3
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
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  const yearDotVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Function to set year
  const setYear = (year) => {
    setFormData(prev => ({ ...prev, year: year.toString() }));
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-900 text-white px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Toast Container */}
      <Toaster position="top-right" />
      
      {/* Background effects - matching ClubDetail */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10">
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
            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Biodata</span>
          </h1>
          <p className="text-gray-300">Complete the form below to submit your information</p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                {/* Photo Upload */}
                <motion.div 
                  className="mb-8 flex flex-col items-center"
                  variants={itemVariants}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, borderColor: 'rgba(124, 58, 237, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                    className="w-40 h-40 rounded-full border-2 border-blue-500/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                    onClick={() => document.getElementById('photo-upload').click()}
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
                          className="text-center p-4"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-2 text-blue-500 group-hover:text-purple-600 transition-colors duration-300" />
                          <p className="text-gray-300 text-sm">Upload Photo</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </motion.div>
                </motion.div>

                {/* Name */}
                <motion.div 
                  className="mb-6 relative group"
                  variants={itemVariants}
                >
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 group-hover:text-purple-600 transition-colors duration-300" />
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </motion.div>

                {/* Gender */}
                <motion.div 
                  className="mb-6"
                  variants={itemVariants}
                >
                  <div className="flex flex-col space-y-3">
                    <label className="text-gray-300 ml-2">Gender</label>
                    <div className="flex gap-4">
                      <motion.label 
                        className="relative flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input 
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleChange}
                          className="peer opacity-0 absolute h-0 w-0"
                        />
                        <motion.div 
                          className="bg-gray-700/50 border border-gray-600 hover:border-blue-500/50 
                                    text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-300
                                    peer-checked:bg-gradient-to-r peer-checked:from-blue-500/20 peer-checked:to-blue-500/10
                                    peer-checked:border-blue-500 peer-checked:shadow-lg peer-checked:shadow-blue-500/20"
                          animate={formData.gender === "Male" ? {
                            backgroundColor: "rgba(37, 99, 235, 0.1)",
                            borderColor: "rgba(59, 130, 246, 0.8)",
                            y: -2
                          } : {}}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                              <AnimatePresence>
                                {formData.gender === "Male" && (
                                  <motion.div 
                                    className="w-2 h-2 rounded-full bg-blue-500"
                                    variants={yearDotVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`font-medium ${formData.gender === "Male" ? "text-white" : "text-gray-300"}`}>
                              Male
                            </span>
                          </div>
                        </motion.div>
                      </motion.label>
                      
                      <motion.label 
                        className="relative flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input 
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleChange}
                          className="peer opacity-0 absolute h-0 w-0"
                        />
                        <motion.div 
                          className="bg-gray-700/50 border border-gray-600 hover:border-purple-600/50 
                                    text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-300
                                    peer-checked:bg-gradient-to-r peer-checked:from-purple-600/20 peer-checked:to-purple-600/10
                                    peer-checked:border-purple-600 peer-checked:shadow-lg peer-checked:shadow-purple-600/20"
                          animate={formData.gender === "Female" ? {
                            backgroundColor: "rgba(124, 58, 237, 0.1)",
                            borderColor: "rgba(147, 51, 234, 0.8)",
                            y: -2
                          } : {}}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-purple-600 flex items-center justify-center">
                              <AnimatePresence>
                                {formData.gender === "Female" && (
                                  <motion.div 
                                    className="w-2 h-2 rounded-full bg-purple-600"
                                    variants={yearDotVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`font-medium ${formData.gender === "Female" ? "text-white" : "text-gray-300"}`}>
                              Female
                            </span>
                          </div>
                        </motion.div>
                      </motion.label>
                    </div>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div 
                  className="mb-6 relative group"
                  variants={itemVariants}
                >
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 group-hover:text-purple-600 transition-colors duration-300" />
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </motion.div>
              </div>

              {/* Right Column */}
              <div>
                {/* SRMIST Vadaplani Check (replacing Email) */}
                <motion.div 
                  className="mb-6"
                  variants={itemVariants}
                >
                  <div className="flex flex-col space-y-3">
                    <label className="text-gray-300 ml-2">Are you from SRMIST Vadaplani?</label>
                    <div className="flex gap-4">
                      <motion.label 
                        className="relative flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input 
                          type="radio"
                          name="isSRMVadaplani"
                          value="Yes"
                          checked={formData.isSRMVadaplani === "Yes"}
                          onChange={handleChange}
                          className="peer opacity-0 absolute h-0 w-0"
                        />
                        <motion.div 
                          className="bg-gray-700/50 border border-gray-600 hover:border-blue-500/50 
                                    text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-300
                                    peer-checked:bg-gradient-to-r peer-checked:from-blue-500/20 peer-checked:to-blue-500/10
                                    peer-checked:border-blue-500 peer-checked:shadow-lg peer-checked:shadow-blue-500/20"
                          animate={formData.isSRMVadaplani === "Yes" ? {
                            backgroundColor: "rgba(37, 99, 235, 0.1)",
                            borderColor: "rgba(59, 130, 246, 0.8)",
                            y: -2
                          } : {}}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                              <AnimatePresence>
                                {formData.isSRMVadaplani === "Yes" && (
                                  <motion.div 
                                    className="w-2 h-2 rounded-full bg-blue-500"
                                    variants={yearDotVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`font-medium ${formData.isSRMVadaplani === "Yes" ? "text-white" : "text-gray-300"}`}>
                              Yes
                            </span>
                          </div>
                        </motion.div>
                      </motion.label>
                      
                      <motion.label 
                        className="relative flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input 
                          type="radio"
                          name="isSRMVadaplani"
                          value="No"
                          checked={formData.isSRMVadaplani === "No"}
                          onChange={handleChange}
                          className="peer opacity-0 absolute h-0 w-0"
                        />
                        <motion.div 
                          className="bg-gray-700/50 border border-gray-600 hover:border-purple-600/50 
                                    text-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-300
                                    peer-checked:bg-gradient-to-r peer-checked:from-purple-600/20 peer-checked:to-purple-600/10
                                    peer-checked:border-purple-600 peer-checked:shadow-lg peer-checked:shadow-purple-600/20"
                          animate={formData.isSRMVadaplani === "No" ? {
                            backgroundColor: "rgba(124, 58, 237, 0.1)",
                            borderColor: "rgba(147, 51, 234, 0.8)",
                            y: -2
                          } : {}}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-purple-600 flex items-center justify-center">
                              <AnimatePresence>
                                {formData.isSRMVadaplani === "No" && (
                                  <motion.div 
                                    className="w-2 h-2 rounded-full bg-purple-600"
                                    variants={yearDotVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                  />
                                )}
                              </AnimatePresence>
                            </div>
                            <span className={`font-medium ${formData.isSRMVadaplani === "No" ? "text-white" : "text-gray-300"}`}>
                              No
                            </span>
                          </div>
                        </motion.div>
                      </motion.label>
                    </div>
                  </div>
                </motion.div>
                
                {/* Registration Number Field - Only shows when isSRMVadaplani is "Yes" */}
                <AnimatePresence>
                  {formData.isSRMVadaplani === "Yes" && (
                    <motion.div 
                      className="mb-6 relative group"
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    >
                      <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 group-hover:text-purple-600 transition-colors duration-300" />
                      <motion.input
                        whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="Registration Number"
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
                        required={formData.isSRMVadaplani === "Yes"}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Department */}
                <motion.div 
                  className="mb-6 relative group"
                  variants={itemVariants}
                >
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 group-hover:text-purple-600 transition-colors duration-300" />
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Department"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </motion.div>

                {/* Class */}
                <motion.div 
                  className="mb-6 relative group"
                  variants={itemVariants}
                >
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 group-hover:text-purple-600 transition-colors duration-300" />
                  <motion.input
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="Class"
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:outline-none focus:border-blue-500 transition-all duration-300"
                    required
                  />
                </motion.div>

                {/* Year Selection - Fixed to properly align with buttons and fit within parent container */}
                <motion.div 
                  className="mb-6"
                  variants={itemVariants}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-gray-300 ml-2">Year</label>
                    <motion.span 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg"
                      layout
                      key={formData.year || 'empty'}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {formData.year ? `${formData.year}${formData.year === '1' ? 'st' : formData.year === '2' ? 'nd' : formData.year === '3' ? 'rd' : 'th'} Year` : 'Select Year'}
                    </motion.span>
                  </div>
                  <motion.div 
                    className="bg-gray-700/50 p-5 rounded-lg border border-gray-600 overflow-hidden"
                    whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
                  >
                    {/* Year Selection Buttons */}
                    <div className="flex justify-between mb-6">
                      {[1, 2, 3, 4].map((year) => (
                        <motion.button
                          key={year}
                          type="button"
                          onClick={() => setYear(year)}
                          className={`w-16 h-16 rounded-full flex flex-col items-center justify-center
                            ${formData.year === year.toString() 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-600/30' 
                              : 'bg-gray-600 hover:bg-gray-500'}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          animate={formData.year === year.toString() ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <span className={`text-lg font-bold ${formData.year === year.toString() ? 'text-white' : 'text-gray-300'}`}>
                            {year}
                          </span>
                          <span className={`text-xs ${formData.year === year.toString() ? 'text-white' : 'text-gray-400'}`}>
                            {year === 1 ? '1st' : year === 2 ? '2nd' : year === 3 ? '3rd' : '4th'}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="relative mt-4">
                      <div className="h-2 w-full bg-gray-600 rounded-full">
                        <motion.div 
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ 
                            width: formData.year ? `${parseInt(formData.year) * 25 - 5}%` : '0%'
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400 text-xs">First Year</span>
                        <span className="text-gray-400 text-xs">Fourth Year</span>
                      </div>
                    </div>
                    <input type="hidden" name="year" value={formData.year} required />
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
                disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  <span>Submit Biodata</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default BiodataForm;