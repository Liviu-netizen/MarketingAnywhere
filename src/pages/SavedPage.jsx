import { Link } from 'react-router-dom'
import MobileContainer from '../components/layout/MobileContainer'
import BottomNav from '../components/layout/BottomNav'
import { mockAgencies } from '../data/mockAgencies'

export default function SavedPage() {
    // Mock saved agencies (in real app, would come from Supabase)
    const savedAgencies = mockAgencies.filter(a => a.is_registered).slice(0, 4)

    return (
        <MobileContainer className="bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Agencies</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{savedAgencies.length} agencies saved</p>
            </header>

            <main className="flex-1 p-4">
                {savedAgencies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-400">favorite_border</span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No saved agencies yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                            Browse agencies and tap the heart icon to save them here for later.
                        </p>
                        <Link
                            to="/search"
                            className="bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30"
                        >
                            Browse Agencies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {savedAgencies.map((agency) => (
                            <Link
                                key={agency.id}
                                to={`/agency/${agency.id}`}
                                className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
                            >
                                <div
                                    className="h-24 bg-cover bg-center bg-gradient-to-br from-primary/20 to-purple-500/20"
                                    style={agency.cover_image ? { backgroundImage: `url("${agency.cover_image}")` } : {}}
                                />
                                <div className="p-3">
                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{agency.name}</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-yellow-500 text-[14px] filled">star</span>
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{agency.rating}</span>
                                        <span className="text-xs text-slate-400">({agency.review_count})</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                                        {agency.location.city}, {agency.location.country}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <BottomNav />
        </MobileContainer>
    )
}
