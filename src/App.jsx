import './App.css'
import LandingPage from './pages/Landing'
import AuthComponent from './pages/Login'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<AuthComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
