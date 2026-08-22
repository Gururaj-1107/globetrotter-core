import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CreateTripPage from './pages/CreateTripPage'
import ItineraryBuilderPage from './pages/ItineraryBuilderPage'
import ItineraryViewPage from './pages/ItineraryViewPage'
import DashboardPage from './pages/DashboardPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage defaultTab="signup" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/:id/builder" element={<ItineraryBuilderPage />} />
        <Route path="/trips/:id/view" element={<ItineraryViewPage />} />
      </Routes>
    </Router>
  )
}

export default App

