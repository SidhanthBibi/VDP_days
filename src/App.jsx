import './App.css'
import LandingPage from './pages/Events'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Clubs from './pages/Clubs'
import About from './pages/About'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<LandingPage />} />
        <Route path='/clubs' element={<Clubs />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;
