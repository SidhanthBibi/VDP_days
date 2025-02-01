import './App.css'
import LandingPage from './components/Landing'
import AuthComponent from './components/Login'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/login' element={<AuthComponent/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
