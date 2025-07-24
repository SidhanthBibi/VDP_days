import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignUpPage from "./pages/SignUp"
import LandingPage from "./pages/Events"
import LoginPage from "./pages/Login"
import Navbar from "./components/Navbar"
import Explore from "./pages/Explore"
import Home from "./pages/Home"
import Clubs from "./pages/Clubs"
import About from "./pages/About"
import ClubDetailForm from "./pages/ClubDetailForm"
import CreateEvent from "./pages/CreateNewEvent"
import ClubDetail from "./pages/ClubDetail"
import SignupTick from "./components/SignUpSuccess.jsx"
import { ClubProvider } from "./context/ClubContext"
import DynamicRegistrationForm from "./components/EventRegistation.jsx"
import LoginSuccess from "./components/LoginSuccess.jsx"
import EditEventForm from "./pages/EditEventForm"
import QrCode from "./pages/QR_Code.jsx"
import NotFound from "./pages/NotFound"
import Biodata from "./pages/Biodata.jsx"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import AnalyticsDashboard from "./pages/Analytics"
import EventRegistrationPage from "./pages/EventRegistrationPage.jsx"
import EventRegistrationDashboard from "./pages/EventRegistrationDashboard.jsx"

// Import dashboard components
import ClubDashboardLayout from "./components/ClubDashboard/ClubDashboardLayout"
import DashboardOverview from "./components/ClubDashboard/DashboardOverview"

function App() {
  console.log('testing...')
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
            <Route
              path="/create_event"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<About />} />
            <Route path="/qrcode" element={<QrCode />} />
            <Route path="/edit-profile" element={<Biodata />} />
            <Route path="*" element={<NotFound />} />

            {/* Dynamic Event Registration Route */}
            <Route path="/event-register/:eventId" element={<DynamicRegistrationForm />} />
            <Route path="/edit-event/:id" element={<EditEventForm />} />
            <Route path="/events/:eventId/register" element={<EventRegistrationPage />} />
            <Route path="/event-registrations/:eventId" element={<EventRegistrationDashboard />} />

            {/* Authentication routes */}
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Club-related routes */}
            <Route path="/clubDetailform" element={<ClubDetailForm />} />
            <Route path="/clubDetail/:id" element={<ClubDetail />} />

            {/* Club Dashboard Routes */}
            <Route path="/dashboard/:clubId" element={<ClubDashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="events" element={<div className="text-white">Events Management - Coming Soon</div>} />
              <Route path="registrations" element={<div className="text-white">Registrations - Coming Soon</div>} />
              <Route path="members" element={<div className="text-white">Members Management - Coming Soon</div>} />
              <Route path="recruitment" element={<div className="text-white">Recruitment - Coming Soon</div>} />
              <Route path="analytics" element={<div className="text-white">Analytics - Coming Soon</div>} />
              <Route path="manage" element={<div className="text-white">Club Management - Coming Soon</div>} />
            </Route>

            {/*Animation router */}
            <Route path="/signupsuccess" element={<SignupTick />} />
            <Route path="/loginsuccess" element={<LoginSuccess />} />
          </Routes>
        </ClubProvider>
      </BrowserRouter>
    </>
  )
}

export default App
