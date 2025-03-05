import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import LandingPage from './pages/Events';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import About from './pages/About';
import ClubDetailForm from './pages/ClubDetailForm';
import CreateEvent from './pages/CreateNewEvent';
import ClubDetail from './pages/ClubDetail';
import SignupTick from './components/SignUpSuccess.jsx';
import { ClubProvider } from './context/ClubContext';
import DynamicRegistrationForm from './components/EventRegistation.jsx';
import LoginSuccess from './components/LoginSuccess.jsx';
import QrCode from './pages/QR_Code.jsx';
import NotFound from './pages/NotFound';
import Biodata from './pages/Biodata.jsx';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
    {/* Vercel Analytics */}
    <Analytics />
    <SpeedInsights />

    <BrowserRouter>
      <ClubProvider>
        <Navbar />
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<LandingPage />} />
          <Route path="/create_event" element={<CreateEvent />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<About />} />
          <Route path="/qrcode" element={<QrCode />} />
          <Route path="/edit-profile" element={<Biodata />} />
          <Route path="*" element={<NotFound />} />
          
          {/* Dynamic Event Registration Route */}
          <Route path="/event-register/:eventId" element={<DynamicRegistrationForm />} />
          
          {/* Legacy direct routes */}
          <Route path="/CodeTheDark" element={<DynamicRegistrationForm />} />
          <Route path="/StudyGroup" element={<DynamicRegistrationForm />} />
          <Route path="/AbroadREG" element={<DynamicRegistrationForm />} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Club-related routes */}
          <Route path="/clubDetailform" element={<ClubDetailForm />} />
          <Route path="/clubDetail/:id" element={<ClubDetail />} />

          {/*Animation router */}
          <Route path="/signupsuccess" element={<SignupTick />} />
          <Route path="/loginsuccess" element={<LoginSuccess />} />
        </Routes>
      </ClubProvider>
    </BrowserRouter>
    
    </>
  );
}

export default App;