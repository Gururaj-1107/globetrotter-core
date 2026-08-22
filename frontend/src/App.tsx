import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CreateTripPage from './pages/CreateTripPage'
import ItineraryBuilderPage from './pages/ItineraryBuilderPage'
import ItineraryViewPage from './pages/ItineraryViewPage'
import DashboardPage from './pages/DashboardPage'
import SearchPage from './pages/SearchPage'
import MyTripsPage from './pages/MyTripsPage'
import CommunityPage from './pages/CommunityPage'
import ProfilePage from './pages/ProfilePage'
import CalendarPage from './pages/CalendarPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage defaultTab="signup" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trips/my-trips" element={<MyTripsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/:id/builder" element={<ItineraryBuilderPage />} />
        <Route path="/trips/:id/view" element={<ItineraryViewPage />} />
      </Routes>
    </Router>
  )
}

export default App

