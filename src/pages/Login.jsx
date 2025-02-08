import React from 'react';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from 'react-router-dom';

const LoginPage = ({ onSuccessfulAuth }) => {
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

    localStorage.setItem('Google_Token', token);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userImage', userData.picture);

    navigate('/events');
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
          <h2 className="text-2xl font-bold text-center mb-8">Welcome Back!</h2>

          <div className="flex items-center justify-center bg-gray-100 rounded-[10px]">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Welcome Back!</h2>
              <p className="text-gray-500 mt-2">Sign in with Google to continue</p>
              <div className="mt-6 ">
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
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:text-blue-400">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;