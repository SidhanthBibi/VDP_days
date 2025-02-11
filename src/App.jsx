import './App.css'
import SignUpPage from './pages/SignUp'
import LandingPage from './pages/Events'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Explore from './pages/Explore'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import About from './pages/About'
import ClubDetailForm from './pages/ClubDetailForm'
import CreateEvent from './pages/CreateNewEvent'
import ClubDetail from './pages/ClubDetail'
import { ClubProvider } from './context/ClubContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ClubProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<LandingPage />} />
          <Route path="/create_event" element={<CreateEvent />} />
          <Route path='/clubs' element={<Clubs />} />
          <Route path="/explore" element={<Explore />} />
          <Route path='/about' element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path='/clubDetailform' element={<ClubDetailForm />} />
          <Route path='/clubDetail/:id' element={<ClubDetail />} />
        </Routes>
      </ClubProvider>
    </BrowserRouter>
  )
}

export default App;