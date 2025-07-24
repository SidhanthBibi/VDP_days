import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UnderConstruction from './pages/UnderConstruction'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UnderConstruction />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
