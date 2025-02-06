import './App.css'
import LandingPage from './pages/Events'
import AuthComponent from './pages/Login'
import Navbar from './components/Navbar'
import Home from './pages/home'
import Home2 from './pages/Home2'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/events" element={<LandingPage />} />
        <Route path='/login' element={<AuthComponent />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;
