import React from 'react';
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from 'react-router-dom';

const LoginPage = ({ onSuccessfulAuth }) => {
  const navigate = useNavigate();
  
  function decodeJWT(value) {
    const base64payload = value.split('.')[1];
    const payload = atob(base64payload);
    return JSON.parse(payload);
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      const token = tokenResponse.access_token;

      // Note: JWT decoding won't work with access_token
      // You'll need to make a request to Google's userinfo endpoint
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(userData => {
          console.log('User Data:', userData);
          
          localStorage.setItem('Google_Token', token);
          localStorage.setItem('userName', userData.name);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userImage', userData.picture);

          navigate('/events');
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    },
    onError: () => {
      console.log('Login Failed');
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-10 border border-gray-700">
          <h2 className="text-2xl font-bold text-center mb-2">Welcome Back!</h2>

          <div className="flex items-center justify-center">
            <div className="w-full p-6 rounded-2xl max-w-sm text-center">
              <p className="text-gray-300 mb-6">login with Google to continue</p>
              
              {/* Custom styled Google login button */}
              <button
                onClick={() => login()}
                className="w-full px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg 
                         flex items-center justify-center gap-3 hover:bg-gray-100 
                         transition-all duration-300 border border-gray-300 shadow-md"
              >
                {/* Google Icon SVG */}
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

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
      </div>
    </div>
  );
};

export default LoginPage;