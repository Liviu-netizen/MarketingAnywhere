import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MobileContainer from '../components/layout/MobileContainer'
import BottomNav from '../components/layout/BottomNav'
import { categories } from '../data/mockAgencies'
import { getAgencies } from '../lib/supabase'

export default function HomePage() {
    const [agencies, setAgencies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadAgencies() {
            const { data, error } = await getAgencies()
            if (data) setAgencies(data)
            setLoading(false)
        }
        loadAgencies()
    }, [])

    const featuredAgencies = agencies.filter(a => a.is_pro || a.verified).slice(0, 4)
    const topRated = agencies.filter(a => a.rating >= 4.8).slice(0, 3)

    return (
        <MobileContainer>
            {/* Header & Search */}
            <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 pb-2">
                <div className="px-4 pt-6 pb-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Location</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">New York, USA</h1>
                            </div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-surface-light dark:bg-surface-dark flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">notifications</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-3">
                        <Link to="/search" className="flex flex-col flex-1 h-12">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full shadow-sm">
                                <div className="text-gray-400 flex border-none bg-surface-light dark:bg-[#282e39] items-center justify-center pl-4 rounded-l-lg">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    readOnly
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-surface-light dark:bg-[#282e39] h-full placeholder:text-gray-400 px-4 rounded-l-none pl-2 text-base font-normal leading-normal cursor-pointer"
                                    placeholder="Search SEO, Branding..."
                                />
                            </div>
                        </Link>
                        <button className="flex items-center justify-center h-12 w-12 bg-primary rounded-lg text-white shadow-lg shadow-primary/30">
                            <span className="material-symbols-outlined">tune</span>
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 px-4 overflow-x-auto hide-scrollbar pb-2">
                    <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white pl-4 pr-3 transition-transform active:scale-95">
                        <p className="text-sm font-medium leading-normal">All</p>
                    </button>
                    {['Budget', 'Rating', 'Delivery'].map((filter) => (
                        <button key={filter} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light dark:bg-[#282e39] border border-gray-100 dark:border-gray-700 pl-4 pr-3 transition-transform active:scale-95">
                            <p className="text-gray-700 dark:text-white text-sm font-medium leading-normal">{filter}</p>
                            <span className="material-symbols-outlined text-gray-500 text-[18px]">keyboard_arrow_down</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <section>
                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight px-4 mb-4">Categories</h2>
                    <div className="grid grid-cols-4 gap-4 px-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                to={`/search?category=${cat.id}`}
                                className="flex flex-col items-center gap-2 group cursor-pointer"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-${cat.color}-100 dark:bg-${cat.color}-900/20 flex items-center justify-center text-${cat.color}-600 dark:text-${cat.color}-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300`}>
                                    <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                </div>
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Top Rated */}
                <section className="mt-8 px-4 pb-4">
                    <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">Top Rated Globally</h2>
                    <div className="flex flex-col gap-4">
                        {topRated.map((agency) => (
                            <Link
                                key={agency.id}
                                to={`/agency/${agency.id}`}
                                className="flex gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800"
                            >
                                <div
                                    className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0 bg-gradient-to-br from-primary/30 to-purple-500/30"
                                    style={agency.logo_url ? { backgroundImage: `url("${agency.logo_url}")` } : {}}
                                />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-base font-bold text-gray-900 dark:text-white">{agency.name}</h3>
                                            {agency.rating === 5.0 && (
                                                <span className="text-primary text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">Top 1%</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                            <span className="material-symbols-outlined text-[14px]">public</span>
                                            <span>{agency.location.city}, {agency.location.country}</span>
                                            <span className="mx-1">•</span>
                                            <span className="text-primary font-medium">{agency.tags[0]}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-[16px] filled">star</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{agency.rating}</span>
                                            <span className="text-xs text-gray-400">({agency.review_count})</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">${agency.pricing.hourly_rate}/hr</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNav />
        </MobileContainer >
    )
}
