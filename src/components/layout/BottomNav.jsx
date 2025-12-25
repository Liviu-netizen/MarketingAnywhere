import { Link, useLocation } from 'react-router-dom'

const navItems = [
    { path: '/', icon: 'explore', label: 'Explore' },
    { path: '/saved', icon: 'favorite', label: 'Saved' },
    { path: '/bookings', icon: 'calendar_month', label: 'Bookings', badge: true },
    { path: '/profile', icon: 'person', label: 'Profile' }
]

export default function BottomNav() {
    const location = useLocation()

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
            <div className="flex justify-between items-center max-w-md mx-auto px-6 py-3">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive(item.path)
                                ? 'text-primary'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                    >
                        <div className="relative">
                            <span className={`material-symbols-outlined text-[24px] ${isActive(item.path) ? 'filled' : ''}`}>
                                {item.icon}
                            </span>
                            {item.badge && (
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark" />
                            )}
                        </div>
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}
