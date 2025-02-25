import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal, UserCircle2, Mail, Phone, Calendar, Users, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const DynamicRegistrationForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  // States for event data and form handling
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    team_name: '',
    participant_1: '',
    participant_2: '',
    participant_3: '',
    participant_4: '',
    participant_5: '',
    participant_6: '',
    institution: '',
    year: '',
    email: '',
    whatsapp: ''
  });

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          navigate('/events'); // Redirect if event not found
          return;
        }
        
        setEventData(data);
      } catch (err) {
        setError('Failed to load event data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [eventId, navigate]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create the registration
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          {
            event_id: eventId,
            team_name: formData.team_name,
            participant_1: formData.participant_1,
            participant_2: formData.participant_2 || null,
            participant_3: formData.participant_3 || null,
            participant_4: formData.participant_4 || null,
            participant_5: formData.participant_5 || null,
            participant_6: formData.participant_6 || null,
            institution: formData.institution,
            year: formData.year,
            email: formData.email,
            whatsapp: formData.whatsapp,
            registration_date: new Date().toISOString(),
            payment_status: 'not applicable'
          }
        ])
        .select();

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        team_name: '',
        participant_1: '',
        participant_2: '',
        participant_3: '',
        participant_4: '',
        participant_5: '',
        participant_6: '',
        institution: '',
        year: '',
        email: '',
        whatsapp: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && !eventData) {
    return (
      <div className="min-h-screen bg-black text-green-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  // Error state
  if (error && !eventData) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        <div className="bg-gray-900/80 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30"
          >
            Return to Events
          </button>
        </div>
      </div>
    );
  }
  
  // If no event data is loaded yet
  if (!eventData) {
    return null;
  }
  
  // Dynamic theme color based on event
  const themeColor = eventData.theme_color || 'green';

  // Determine max participants to show based on event data
  const maxParticipants = eventData.max_team_size || 6;
  
  return (
    <div className={`min-h-screen bg-black text-${themeColor}-500`}>
      {/* Cyber grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-red-900/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start relative">
          {/* Left Column - Event Information */}
          <div className="space-y-8">
            {/* Poster Section */}
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000`}></div>
              <div className="relative">
                <img 
                  src={eventData.poster}
                  alt={`${eventData.event_name} Event Poster`}
                  className="rounded-lg w-full object-cover"
                />
              </div>
            </div>

            {/* Event Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-${themeColor}-500/20 group hover:border-${themeColor}-500 transition-colors duration-300`}>
                <Calendar className={`w-6 h-6 text-${themeColor}-500 mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className={`text-xl font-bold text-${themeColor}-400`}>Date</h3>
                <p className="text-gray-400">{eventData.date}</p>
                <p className="text-gray-400 text-sm mt-1">Limited slots available</p>
              </div>
              <div className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-${themeColor}-500/20 group hover:border-${themeColor}-500 transition-colors duration-300`}>
                <Users className={`w-6 h-6 text-${themeColor}-500 mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className={`text-xl font-bold text-${themeColor}-400`}>Teams</h3>
                <p className="text-gray-400">{eventData.team_size || '1-2 Members'}</p>
                <p className="text-gray-400 text-sm mt-1">Registration Fee: ₹{eventData.price || '0'}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-${themeColor}-500/20`}>
              <h3 className={`text-xl font-bold text-${themeColor}-400 mb-4`}>Event Details</h3>
              <p className="text-gray-400 mb-6">{eventData.description}</p>
              
              <h3 className={`text-xl font-bold text-${themeColor}-400 mb-4 mt-6`}>Event Highlights</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ChevronRight className={`w-5 h-5 text-${themeColor}-500 mt-1 mr-2`} />
                  <span>Join an exciting event organized by {eventData.club_name}</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className={`w-5 h-5 text-${themeColor}-500 mt-1 mr-2`} />
                  <span>Win exciting prizes</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className={`w-5 h-5 text-${themeColor}-500 mt-1 mr-2`} />
                  <span>Certificate for all participants</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="sticky top-8">
            <div className={`bg-gray-900/80 backdrop-blur-sm rounded-lg border border-${themeColor}-500/20 overflow-hidden`}>
              {/* Form Header */}
              <div className={`bg-gradient-to-r from-${themeColor}-500/10 to-purple-500/10 p-6 border-b border-${themeColor}-500/20`}>
                <div className="flex items-center gap-4">
                  <Terminal className={`w-8 h-8 text-${themeColor}-500`} />
                  <h2 className={`text-2xl font-bold text-${themeColor}-400`}>Registration Form</h2>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Team Details */}
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="text"
                      name="team_name"
                      value={formData.team_name}
                      onChange={handleInputChange}
                      placeholder="Team Name"
                      required
                      className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Participant 1 (Required) */}
                    <div className="relative group">
                      <input
                        type="text"
                        name="participant_1"
                        value={formData.participant_1}
                        onChange={handleInputChange}
                        placeholder="Participant 1"
                        required
                        className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                      />
                      <UserCircle2 className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${themeColor}-500/50`} />
                    </div>

                    {/* Participant 2 (Optional) */}
                    {maxParticipants >= 2 && (
                      <div className="relative group">
                        <input
                          type="text"
                          name="participant_2"
                          value={formData.participant_2}
                          onChange={handleInputChange}
                          placeholder="Participant 2 (Optional)"
                          className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                        />
                        <UserCircle2 className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${themeColor}-500/50`} />
                      </div>
                    )}

                    {/* Participant 3 (Optional) */}
                    {maxParticipants >= 3 && (
                      <div className="relative group">
                        <input
                          type="text"
                          name="participant_3"
                          value={formData.participant_3}
                          onChange={handleInputChange}
                          placeholder="Participant 3 (Optional)"
                          className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                        />
                        <UserCircle2 className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${themeColor}-500/50`} />
                      </div>
                    )}

                    {/* Participant 4 (Optional) */}
                    {maxParticipants >= 4 && (
                      <div className="relative group">
                        <input
                          type="text"
                          name="participant_4"
                          value={formData.participant_4}
                          onChange={handleInputChange}
                          placeholder="Participant 4 (Optional)"
                          className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                        />
                        <UserCircle2 className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${themeColor}-500/50`} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Institution Details */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold text-${themeColor}-400`}>Institution</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['SRMIST VDP', 'Other'].map((option) => (
                      <label key={option} className="relative group cursor-pointer">
                        <input
                          type="radio"
                          name="institution"
                          value={option}
                          checked={formData.institution === option}
                          onChange={handleInputChange}
                          required
                          className="peer sr-only"
                        />
                        <div className={`w-full p-3 bg-black/50 border border-${themeColor}-500/20 rounded-lg text-center peer-checked:border-${themeColor}-500 peer-checked:bg-${themeColor}-500/10 transition-all duration-300`}>
                          <span className={`text-${themeColor}-500`}>{option}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Year Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">Year</h3>
                  <div className="flex flex-wrap gap-4">
                    {['I', 'II', 'III', 'IV'].map((yearOption) => (
                      <label key={yearOption} className="relative group cursor-pointer">
                        <input
                          type="radio"
                          name="year"
                          value={yearOption}
                          checked={formData.year === yearOption}
                          onChange={handleInputChange}
                          required
                          className="peer sr-only"
                        />
                        <div className="w-16 p-3 bg-black/50 border border-green-500/20 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-500/10 transition-all duration-300">
                          <span className="text-green-500">{yearOption}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${themeColor}-500/50`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg pl-12 px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                    />
                  </div>
                  <div className="relative group">
                    <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${themeColor}-500/50`} />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="WhatsApp Number"
                      required
                      className={`w-full bg-black/50 border border-${themeColor}-500/20 rounded-lg pl-12 px-4 py-3 text-${themeColor}-500 placeholder-${themeColor}-500/50 focus:border-${themeColor}-500 focus:ring-1 focus:ring-${themeColor}-500 transition-all duration-300`}
                    />
                  </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className={`bg-${themeColor}-500/10 border border-${themeColor}-500 text-${themeColor}-500 p-4 rounded-lg`}>
                    Registration successful!
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1.5"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                    I agree to the{' '}
                    <a 
                    href="/policies/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-${themeColor}-500 hover:text-${themeColor}-400`}
                    >
                    Terms & Conditions
                    </a>
                    {' '}and{' '}
                    <a 
                    href="/policies/privacy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-${themeColor}-500 hover:text-${themeColor}-400`}
                    >
                    Privacy Policy
                    </a>
                </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-purple-600 text-white py-4 rounded-lg font-bold relative group overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">
                    {loading ? 'Registering...' : 'Register Now'}
                  </span>
                </button>
              </form>

              {/* Policy Links */}
              <div className={`border-t border-${themeColor}-500/20 p-6`}>
                <div className="space-y-2">
                    <h3 className={`text-lg font-semibold text-${themeColor}-400 mb-4`}>Important Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                    <a 
                        href="/policies/contact.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm text-${themeColor}-500 hover:text-${themeColor}-400 transition-colors`}
                    >
                        Contact Us
                    </a>
                    <a 
                        href="/policies/terms.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm text-${themeColor}-500 hover:text-${themeColor}-400 transition-colors`}
                    >
                        Terms & Conditions
                    </a>
                    <a 
                        href="/policies/refunds.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm text-${themeColor}-500 hover:text-${themeColor}-400 transition-colors`}
                    >
                        Refund Policy
                    </a>
                    <a 
                        href="/policies/privacy.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-sm text-${themeColor}-500 hover:text-${themeColor}-400 transition-colors`}
                    >
                        Privacy Policy
                    </a>
                    </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`border-t border-${themeColor}-500/20 p-6`}>
                <div className="text-sm text-gray-400">
                  <p className="mb-2">For queries contact:</p>
                  <p>{eventData.club_name} Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRegistrationForm;