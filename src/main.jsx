import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';
import { SpeedInsights } from "@vercel/speed-insights/react"

const ClientID = '1028081832518-6gsauhqpour4leftuksrog95fc76a1r9.apps.googleusercontent.com';

const Root = () => {
  return(
    <GoogleOAuthProvider clientId= {ClientID} >
      <App />
    </GoogleOAuthProvider>
  ); 
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Root />
);