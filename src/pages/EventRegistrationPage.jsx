import React, { useState, useEffect } from 'react';
import { Plus, Minus, Upload, Users, Calendar, MapPin, DollarSign } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your registration has been submitted and is pending approval.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        {event && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.event_name}</h1>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {event.start_date && new Date(event.start_date).toLocaleDateString()}
                    {event.start_time && ` at ${event.start_time}`}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    ₹{event.price || 0}
                  </div>
                  {event.club_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      {event.club_name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              Team Registration
            </h2>

            <div className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-black"
                  placeholder="Enter your team name"
                  required
                />
              </div>

              {/* Participants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Participants *
                  </label>
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Participant
                  </button>
                </div>

                {formData.participants.map((participant, index) => (
                  <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-800">
                        Participant {index + 1}
                      </h4>
                      {formData.participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-black"
                          placeholder="Full Name"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={participant.className}
                          onChange={(e) => updateParticipant(index, 'className', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-black"
                          placeholder="Class Name"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={participant.college}
                          onChange={(e) => updateParticipant(index, 'college', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-black"
                          placeholder="College Name"
                          required
                        />
                      </div>
                      <div>
                        <select
                          value={participant.year}
                          onChange={(e) => updateParticipant(index, 'year', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-black"
                          placeholder="Select Year"
                        >
                          <option value="1st year">1st Year</option>
                          <option value="2nd year">2nd Year</option>
                          <option value="3rd year">3rd Year</option>
                          <option value="4th year">4th Year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Screenshot *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
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
                  <label
                    htmlFor="payment-upload"
                    className="inline-block bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                  >
                    Choose File
                  </label>
                  {paymentScreenshot && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {paymentScreenshot.name}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Registering...' : 'Register Now'}
              </button>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>
            
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg mb-4">
                <p className="text-sm opacity-90">Registration Fee</p>
                <p className="text-2xl font-bold">₹{event?.price || 0}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Scan QR Code to Pay</p>
                <div className="inline-block p-2 bg-white rounded-lg shadow-sm">
                  <img
                    src={generateUPIQR()}
                    alt="UPI QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  UPI ID: georgeadorn58@oksbi
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Payment Instructions:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Scan the QR code using any UPI app</li>
                <li>• Complete the payment</li>
                <li>• Take a screenshot of the payment confirmation</li>
                <li>• Upload the screenshot in the form</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationPage;