import React, { useState } from 'react';
import { Terminal, UserCircle2, Mail, Phone, Calendar, Users, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import Poster from '../assets/CodeTheDark_Poster.png';

const CyberpunkForm = () => {
  const [formData, setFormData] = useState({
    team_name: '',
    participant_1: '',
    participant_2: '',
    institution: '',
    year: '',
    email: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (registrationId) => {
    const res = await initializeRazorpay();
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    // Calculate amount based on number of participants (₹5 for 1 person, ₹10 for 2)
    const amount = formData.participant_2 ? 10 : 5;

    const options = {
      key: "rzp_test_72S71RvJ1kSI1j",
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Technozarre'25",
      description: "Code in the Dark Registration",
      order_id: "", // This should come from your backend
      handler: async function (response) {
        try {
          // Update the registration with payment details
          const { error } = await supabase
            .from('registrations')
            .update({
              payment_status: 'completed',
              payment_id: response.razorpay_payment_id,
              payment_amount: amount
            })
            .eq('id', registrationId);

          if (error) throw error;
          
          setSuccess(true);
          // Reset form after successful payment
          setFormData({
            team_name: '',
            participant_1: '',
            participant_2: '',
            institution: '',
            year: '',
            email: '',
            whatsapp: ''
          });
        } catch (err) {
          setError(err.message);
        }
      },
      prefill: {
        name: formData.participant_1,
        email: formData.email,
        contact: formData.whatsapp
      },
      theme: {
        color: "#10B981" // Green-500 color
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, create the registration
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          {
            team_name: formData.team_name,
            participant_1: formData.participant_1,
            participant_2: formData.participant_2 || null,
            institution: formData.institution,
            year: formData.year,
            email: formData.email,
            whatsapp: formData.whatsapp,
            registration_date: new Date().toISOString(),
            payment_status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      // If registration is successful, initiate payment
      if (data && data[0]) {
        await handlePayment(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500">
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
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <div className="relative">
                <img 
                  src= {Poster}
                  alt="Technozarre'25 - Code in the Dark Event Poster"
                  className="rounded-lg w-full object-cover"
                />
              </div>
            </div>

            {/* Event Details Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-green-500/20 group hover:border-green-500 transition-colors duration-300">
                <Calendar className="w-6 h-6 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-green-400">Date</h3>
                <p className="text-gray-400">17/02/2025</p>
                <p className="text-gray-400 text-sm mt-1">75/140 Slots</p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-green-500/20 group hover:border-green-500 transition-colors duration-300">
                <Users className="w-6 h-6 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-green-400">Teams</h3>
                <p className="text-gray-400">1-2 Members</p>
                <p className="text-gray-400 text-sm mt-1">Registration Fee: ₹70/person</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg border border-green-500/20">
              <h3 className="text-xl font-bold text-green-400 mb-4">Faculty Coordinator</h3>
              <p className="text-gray-400">Dr. N. Bharathi Gopalaamy</p>
              
              <h3 className="text-xl font-bold text-green-400 mb-4 mt-6">Event Highlights</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-2" />
                  <span>Code without preview - pure skill challenge</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-2" />
                  <span>Win exciting prizes worth ₹75,000</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-green-500 mt-1 mr-2" />
                  <span>Certificate for all participants</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="sticky top-8">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-green-500/20 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 p-6 border-b border-green-500/20">
                <div className="flex items-center gap-4">
                  <Terminal className="w-8 h-8 text-green-500" />
                  <h2 className="text-2xl font-bold text-green-400">Registration Form</h2>
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
                      className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-green-500 placeholder-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <input
                        type="text"
                        name="participant_1"
                        value={formData.participant_1}
                        onChange={handleInputChange}
                        placeholder="Participant 1"
                        required
                        className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-green-500 placeholder-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
                      />
                      <UserCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500/50" />
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        name="participant_2"
                        value={formData.participant_2}
                        onChange={handleInputChange}
                        placeholder="Participant 2 (Optional)"
                        className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-3 text-green-500 placeholder-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
                      />
                      <UserCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500/50" />
                    </div>
                  </div>
                </div>

                {/* Institution Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">Institution</h3>
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
                        <div className="w-full p-3 bg-black/50 border border-green-500/20 rounded-lg text-center peer-checked:border-green-500 peer-checked:bg-green-500/10 transition-all duration-300">
                          <span className="text-green-500">{option}</span>
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
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500/50" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className="w-full bg-black/50 border border-green-500/20 rounded-lg pl-12 px-4 py-3 text-green-500 placeholder-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500/50" />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="WhatsApp Number"
                      required
                      className="w-full bg-black/50 border border-green-500/20 rounded-lg pl-12 px-4 py-3 text-green-500 placeholder-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300"
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
                  <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg">
                    Registration successful!
                  </div>
                )}

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

              {/* Contact Information */}
              <div className="border-t border-green-500/20 p-6">
                <div className="text-sm text-gray-400">
                  <p className="mb-2">For queries contact:</p>
                  <p>Aayush - 7903543635</p>
                  <p>Saidivya - 9014867914</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkForm;