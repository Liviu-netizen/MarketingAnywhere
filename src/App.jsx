import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import AgencyProfilePage from './pages/AgencyProfilePage'
import ReviewsPage from './pages/ReviewsPage'
import PricingPage from './pages/PricingPage'
import ChatPage from './pages/ChatPage'
import SavedPage from './pages/SavedPage'
import BookingsPage from './pages/BookingsPage'
import ProfilePage from './pages/ProfilePage'

function App() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/agency/:id" element={<AgencyProfilePage />} />
                <Route path="/agency/:id/reviews" element={<ReviewsPage />} />
                <Route path="/agency/:id/pricing" element={<PricingPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:agencyId" element={<ChatPage />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </div>
    )
}

export default App
