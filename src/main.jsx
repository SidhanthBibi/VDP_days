import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';
import Navbar from './components/Navbar.jsx';

const ClientID = '220301512419-las49tk01j9chkdubbdkp679m44qiu3s.apps.googleusercontent.com';

const Root = () => {
  return (
      // <GoogleOAuthProvider clientId={ClientID}>
    <>
        <App />
    </>
      // </GoogleOAuthProvider>
  );
};

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<Root />);