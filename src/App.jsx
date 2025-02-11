import './App.css'
import SignUpPage from './pages/SignUp'
import LandingPage from './pages/Events'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import About from './pages/About'
import ClubDetail from './pages/ClubDetail'
import CreateEvent from './pages/CreateNewEvent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <SpeedInsights />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<LandingPage />} />
        <Route path="/create_event" element={<CreateEvent />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/clubDetail" element={<ClubDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
