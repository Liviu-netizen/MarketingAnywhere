import { useState } from 'react'
import MobileContainer from '../components/layout/MobileContainer'
import BottomNav from '../components/layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { signIn, signOut } from '../lib/supabase'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
    const { user, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authLoading, setAuthLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSignIn = async (e) => {
        e.preventDefault()
        setAuthLoading(true)
        setError(null)
        const { error } = await signIn(email, password)
        if (error) setError(error.message)
        setAuthLoading(false)
    }

    const handleSignOut = async () => {
        await signOut()
    }

    const menuItems = [
        { icon: 'person', label: 'Edit Profile', path: '/profile/edit' },
        { icon: 'favorite', label: 'Saved Agencies', path: '/saved' },
        { icon: 'calendar_today', label: 'My Bookings', path: '/bookings' },
        { icon: 'payments', label: 'Subscription', path: '/profile/subscription' },
        { icon: 'settings', label: 'Settings', path: '/profile/settings' },
        { icon: 'help', label: 'Help & Support', path: '/profile/help' },
    ]

    if (loading) return (
        <MobileContainer className="bg-background-light dark:bg-background-dark">
            <div className="flex items-center justify-center flex-1">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <BottomNav />
        </MobileContainer>
    )

    return (
        <MobileContainer className="bg-background-light dark:bg-background-dark flex flex-col h-screen">
            <header className="px-4 py-4 pt-10 bg-primary dark:bg-primary/20">
                <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-primary-foreground/80 dark:text-gray-400 text-sm">
                    {user ? `Settings for ${user.email}` : 'Join us to access all features'}
                </p>
            </header>

            <main className="flex-1 overflow-y-auto px-4 -mt-6">
                {user ? (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden pb-6 border border-slate-100 dark:border-slate-800">
                        {/* User Info Header */}
                        <div className="flex flex-col items-center py-8 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 relative">
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} className="w-full h-full rounded-full object-cover" alt="Profile" />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                                )}
                                <div className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border-2 border-white dark:border-surface-dark">
                                    <span className="material-symbols-outlined text-[14px] text-white">edit</span>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.user_metadata?.full_name || user.email.split('@')[0]}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 tracking-tight">{user.email}</p>
                        </div>

                        {/* Menu List */}
                        <div className="py-2">
                            {menuItems.map((item, idx) => (
                                <Link
                                    key={idx}
                                    to={item.path}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">{item.icon}</span>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
                                </Link>
                            ))}
                        </div>

                        <div className="px-6 mt-4">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-bold"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden p-6 border border-slate-100 dark:border-slate-800">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Access your saved agencies and history</p>
                        </div>

                        <form onSubmit={handleSignIn} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">error</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all shadow-inner"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white transition-all shadow-inner"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
                            >
                                {authLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Sign up now</span>
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <BottomNav />
        </MobileContainer>
    )
}
