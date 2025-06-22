import React, { useState, useEffect } from 'react';
import { Plus, Minus, Upload, Users, Calendar, MapPin, DollarSign, Clock, Globe } from 'lucide-react';
import { useParams } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';

const EventRegistrationPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { eventId } = useParams();
  const [formData, setFormData] = useState({
    teamName: '',
    participants: [
      {
        name: '',
        className: '',
        college: '',
        year: '1st year'
      }
    ]
  });
  
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  // Fetch event data
  useEffect(() => {
    fetchEventData();
  }, [eventId]);



  const fetchEventData = async () => {
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      setEvent(data);
    } catch (err) {
      setError(`Failed to fetch event data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };



  // Generate UPI QR Code URL
  const generateUPIQR = () => {
    if (!event) return '';
    const upiId = 'georgeadorn58@oksbi';
    const amount = event.price || 0;
    const note = `Registration for ${event.event_name}`;
    const upiString = `upi://pay?pa=${upiId}&am=${amount}&tn=${encodeURIComponent(note)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [
        ...prev.participants,
        {
          name: '',
          className: '',
          college: '',
          year: '1st year'
        }
      ]
    }));
  };

  const removeParticipant = (index) => {
    if (formData.participants.length > 1) {
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.filter((_, i) => i !== index)
      }));
    }
  };

  const updateParticipant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setPaymentScreenshot(file);
      setError('');
    }
  };

  const uploadPaymentScreenshot = async () => {
    if (!paymentScreenshot) return null;
    
    const fileExt = paymentScreenshot.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .upload(fileName, paymentScreenshot);
    
    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate form
      if (!formData.teamName.trim()) {
        throw new Error('Team name is required');
      }
      
      for (let participant of formData.participants) {
        if (!participant.name.trim() || !participant.className.trim() || !participant.college.trim()) {
          throw new Error('All participant fields are required');
        }
      }
      
      if (!paymentScreenshot) {
        throw new Error('Payment screenshot is required');
      }

      // Upload payment screenshot
      const screenshotPath = await uploadPaymentScreenshot();
      
      // Get public URL for the uploaded screenshot
      const { data: urlData } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(screenshotPath);

      // Insert registration data
      const { error: insertError } = await supabase
        .from('registrations')
        .insert({
          event_id: eventId,
          team_name: formData.teamName,
          participants: formData.participants,
          payment_screenshot_url: urlData.publicUrl
        });

      if (insertError) throw insertError;
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        {/* Neon Circle Accents */}
        <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="backdrop-blur-md bg-gray-900/50 p-8 rounded-xl border border-gray-700/50 text-center max-w-md relative z-10">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-300 mb-6">Your registration has been submitted and is pending approval.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-[20px] 
              hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
              shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Neon Circle Accents */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Event Header */}
        {event && (
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Event Poster */}
              {event.poster && (
                <div className="w-48 h-64 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={event.poster} 
                    alt={event.event_name}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {event.event_name}
                </h1>
                <p className="text-gray-300 mb-6 text-lg">{event.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p>{event.start_date && new Date(event.start_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Time</p>
                      <p>{event.start_time} - {event.end_time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-300">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Price</p>
                      <p>₹{event.price || 0}</p>
                    </div>
                  </div>
                  
                  {event.club_name && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Users className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Organized by</p>
                        <p>{event.club_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.websiteLink && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Globe className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Website</p>
                        <a 
                          href={event.websiteLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              <Users className="w-6 h-6 text-blue-400" />
              Team Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your team name"
                  required
                />
              </div>

              {/* Participants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Participants *
                  </label>
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Participant
                  </button>
                </div>

                {formData.participants.map((participant, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-200">
                        Participant {index + 1}
                      </h4>
                      {formData.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full Name"
                        required
                      />
                      <input
                        type="text"
                        value={participant.className}
                        onChange={(e) => updateParticipant(index, 'className', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Class Name"
                        required
                      />
                      <input
                        type="text"
                        value={participant.college}
                        onChange={(e) => updateParticipant(index, 'college', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="College Name"
                        required
                      />
                      <select
                        value={participant.year}
                        onChange={(e) => updateParticipant(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1st year">1st Year</option>
                        <option value="2nd year">2nd Year</option>
                        <option value="3rd year">3rd Year</option>
                        <option value="4th year">4th Year</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Screenshot *
                </label>
                <div 
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('payment-upload').click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-2">
                    Upload payment screenshot (Max 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-upload"
                    required
                  />
                  <div className="inline-block bg-gray-800 text-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700">
                    Choose File
                  </div>
                  {paymentScreenshot && (
                    <p className="text-sm text-blue-400 mt-2">
                      ✓ {paymentScreenshot.name}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-[20px] 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
                  disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Registering...' : 'Register Now'}
              </button>
            </form>
          </div>

          {/* Payment Section */}
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Payment Details
            </h2>
            
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <p className="text-sm opacity-90 mb-2">Registration Fee</p>
                <p className="text-3xl font-bold">₹{event?.price || 0}</p>
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <p className="text-sm text-gray-300 mb-4">Scan QR Code to Pay</p>
                <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                  <img
                    src={generateUPIQR()}
                    alt="UPI QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  UPI ID: georgeadorn58@oksbi
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/50 p-6 rounded-xl">
              <h3 className="font-medium text-blue-300 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Instructions:
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Scan the QR code using any UPI app
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Complete the payment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Take a screenshot of the payment confirmation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Upload the screenshot in the form
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;