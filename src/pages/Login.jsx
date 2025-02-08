import React, { useState } from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Users, Link, Building, Mail, Image } from 'lucide-react';

const AuthComponent = ({ onSuccessfulAuth }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isClub, setIsClub] = useState(false);
  const [showClubForm, setShowClubForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  function decodeJWT(value){
    const base64payload = value.split('.')[1];
    const payload = atob(base64payload);
    return JSON.parse(payload);
  }

  function Success(responce){
      console.log(responce);
      const token = responce.credential;

      const userData = decodeJWT(token);
      console.log(`Decode Value : `,userData);

      localStorage.setItem('Google_Token',token);
      localStorage.setItem('userName',userData.name);
      localStorage.setItem('userEmail',userData.email);
      localStorage.setItem('userImage',userData.picture);

      navigate('/events');

  }

  function Error(responce){
    console.log('Login Failed');
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [clubData, setClubData] = useState({
    clubName: '',
    logo: null,
    domain: '',
    department: '',
    instagram: '',
    linkedin: '',
    aboutUs: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
      onSuccessfulAuth();
    } else if (!isClub) {
      // Handle student signup
      onSuccessfulAuth();
    } else {
      // Show club details form
      setShowClubForm(true);
    }
  };

  const handleClubSubmit = (e) => {
    e.preventDefault();
    // Handle club registration
    onSuccessfulAuth();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative">
        {/* Auth Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-lg">
            <button
              className={`px-6 py-2 rounded-md transition-all ${
                isLogin ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-all ${
                !isLogin ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        {!showClubForm ? (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-center mb-8">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>

            {/* User Type Toggle for Sign Up */}
            {!isLogin && (
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 bg-gray-700/50 p-2 rounded-lg">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      !isClub ? 'bg-blue-600' : 'hover:bg-gray-600'
                    }`}
                    onClick={() => setIsClub(false)}
                  >
                    <User size={16} />
                    Student
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                      isClub ? 'bg-blue-600' : 'hover:bg-gray-600'
                    }`}
                    onClick={() => setIsClub(true)}
                  >
                    <Users size={16} />
                    Club
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button><br /><br />
              <div>
                  <GoogleLogin onSuccess={Success} onError={Error} width= '250px'/>
              </div>
            </form>
          </div>
        ) : (
          // Club Details Form
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-center mb-8">Club Details</h2>
            
            <form onSubmit={handleClubSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Club Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
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
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instagram URL</label>
                <input
                  type="url"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">About Club</label>
                <textarea
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg 
                  hover:from-blue-600 hover:to-purple-700 transition-all duration-300 
                  shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
              >
                Complete Registration
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;