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
import SignupTick from './components/SignUpSuccess.jsx'
import { ClubProvider } from './context/ClubContext';
import CodeTheDark_Reg from './pages/CodeTheDark_RegisterPage.jsx';
import StudyGroup from './pages/StudyGroup_Reg.jsx';
import AbroadREG from './pages/AbroadREG.jsx'
import LoginSuccess from './components/LoginSuccess.jsx';
import NotFound from './pages/NotFound';
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
          <Route path="/CodeTheDark" element={<CodeTheDark_Reg />} />
          <Route path="/StudyGroup" element={<StudyGroup />} />
          <Route path="/AbroadREG" element={<AbroadREG />} />
          <Route path="*" element={<NotFound />} />
          
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