import MobileContainer from '../components/layout/MobileContainer'
import BottomNav from '../components/layout/BottomNav'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth()

    const menuItems = [
        { icon: 'person', label: 'Edit Profile', path: '/profile/edit' },
        { icon: 'notifications', label: 'Notifications', path: '/profile/notifications' },
        { icon: 'lock', label: 'Privacy & Security', path: '/profile/privacy' },
        { icon: 'help', label: 'Help & Support', path: '/profile/help' },
        { icon: 'info', label: 'About', path: '/profile/about' },
    ]

    return (
        <MobileContainer className="bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="bg-gradient-to-br from-primary to-blue-600 px-4 pt-8 pb-16">
                <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
                        <span className="material-symbols-outlined text-4xl text-white">person</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {isAuthenticated ? user?.email?.split('@')[0] : 'Guest User'}
                        </h2>
                        <p className="text-blue-100">
                            {isAuthenticated ? user?.email : 'Sign in to save favorites'}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 -mt-8 px-4">
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {!isAuthenticated && (
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                            <button className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30">
                                <span className="material-symbols-outlined">login</span>
                                Sign In
                            </button>
                            <button className="w-full mt-2 text-primary font-medium py-2">
                                Create Account
                            </button>
                        </div>
                    )}

                    {menuItems.map((item, idx) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <span className="flex-1 text-left font-medium text-slate-900 dark:text-white">{item.label}</span>
                            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                        </button>
                    ))}
                </div>

                {/* Sign Out */}
                {isAuthenticated && (
                    <button className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 font-medium py-3">
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                )}

                {/* App Version */}
                <p className="text-center text-slate-400 text-xs mt-8 mb-4">
                    NowMarketing v1.0.0
                </p>
            </main>

            <BottomNav />
        </MobileContainer>
    )
}
