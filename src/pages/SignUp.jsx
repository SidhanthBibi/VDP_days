import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const SignUpPage = ({ onSuccessfulAuth }) => {
  const [isClub, setIsClub] = useState(false);
  const navigate = useNavigate();

  function decodeJWT(value) {
    const base64payload = value.split('.')[1];
    const payload = atob(base64payload);
    return JSON.parse(payload);
  }

  function Success(response) {
    console.log(response);
    const token = response.credential;

    const userData = decodeJWT(token);
    console.log(`Decode Value : `, userData);

    // Store user data in localStorage
    localStorage.setItem('Google_Token', token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userImage', userData.picture);
    localStorage.setItem('userType', isClub ? 'club' : 'student');

    // Redirect based on user type
    if (isClub) {
      navigate('/clubDetail');
    } else {
      navigate('/events');
    }
  }

  function Error(response) {
    console.log('Login Failed');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-8">Create Account</h2>

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

          <div className="flex items-center justify-center bg-gray-100 rounded-[10px]">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Get Started</h2>
              <p className="text-gray-500 mt-2">
                Sign up with Google as a {isClub ? 'Club' : 'Student'}
              </p>
              <div className="mt-6">
                <GoogleLogin
                  onSuccess={Success}
                  onError={Error}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;