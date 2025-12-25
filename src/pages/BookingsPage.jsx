import { useState, useEffect } from 'react'
import MobileContainer from '../components/layout/MobileContainer'
import BottomNav from '../components/layout/BottomNav'
import { Link } from 'react-router-dom'
import { getUserBookings } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function BookingsPage() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadBookings() {
            if (!user) {
                setLoading(false)
                return
            }
            const { data } = await getUserBookings(user.id)
            if (data) setBookings(data)
            setLoading(false)
        }
        loadBookings()
    }, [user])

    const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
    const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

    if (loading) {
        return (
            <MobileContainer className="bg-background-light dark:bg-background-dark">
                <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
                </header>
                <main className="flex-1 p-4 flex items-center justify-center">
                    <p className="text-slate-500 dark:text-slate-400">Loading bookings...</p>
                </main>
                <BottomNav />
            </MobileContainer>
        )
    }

    return (
        <MobileContainer className="bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
            </header>

            <main className="flex-1 p-4 space-y-6">
                {/* Upcoming */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Upcoming</h2>
                    {upcomingBookings.length === 0 ? (
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center">
                            <p className="text-slate-500 dark:text-slate-400">No upcoming bookings</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-primary font-bold">
                                        {booking.agency.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{booking.agency.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{booking.service}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-primary font-medium">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.time}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                        Upcoming
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Past */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Past</h2>
                    {pastBookings.length === 0 ? (
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 text-center">
                            <p className="text-slate-500 dark:text-slate-400">No past bookings</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pastBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 opacity-75"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                                        {booking.agency.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{booking.agency.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{booking.service}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                            <span className="material-symbols-outlined text-[14px]">event_available</span>
                                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">
                                        Completed
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* CTA */}
                <div className="pt-4">
                    <Link
                        to="/search"
                        className="block w-full text-center bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30"
                    >
                        Book a Consultation
                    </Link>
                </div>
            </main>

            <BottomNav />
        </MobileContainer>
    )
}
