import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import MobileContainer from '../components/layout/MobileContainer'
import BottomNav from '../components/layout/BottomNav'
import { getAgencies } from '../lib/supabase'

export default function SearchPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [activeFilters, setActiveFilters] = useState(['New York'])
    const [agencies, setAgencies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchResults() {
            setLoading(true)
            const { data } = await getAgencies({
                location: activeFilters.includes('New York') ? 'New York' : null,
                category: searchParams.get('category')
            })
            if (data) setAgencies(data)
            setLoading(false)
        }
        fetchResults()
    }, [activeFilters, searchParams])

    const removeFilter = (filter) => {
        setActiveFilters(activeFilters.filter(f => f !== filter))
    }

    return (
        <MobileContainer className="bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-800 dark:text-white">arrow_back</span>
                    </button>
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-10 py-2.5 bg-white dark:bg-card-dark border-none rounded-xl text-sm focus:ring-2 focus:ring-primary shadow-sm placeholder-slate-400 text-slate-900 dark:text-white"
                            placeholder="Search agencies..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                                >
                                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-300 text-[18px]">close</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <button className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors relative">
                        <span className="material-symbols-outlined text-slate-800 dark:text-white">tune</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-background-light dark:border-background-dark" />
                    </button>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3">
                    {activeFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => removeFilter(filter)}
                            className="flex shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 active:scale-95 transition-transform"
                        >
                            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                            <span className="text-primary text-sm font-medium whitespace-nowrap">{filter}</span>
                            <span className="material-symbols-outlined text-primary text-[16px]">close</span>
                        </button>
                    ))}
                    {['Budget', 'Audience', 'Top Rated'].map((filter) => (
                        <button
                            key={filter}
                            className="flex shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-700 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[18px]">
                                {filter === 'Budget' ? 'attach_money' : filter === 'Audience' ? 'group' : 'star'}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium whitespace-nowrap">{filter}</span>
                            <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Results */}
            <main className="px-4 py-4 flex flex-col gap-4">
                {loading ? (
                    <>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-transparent animate-pulse">
                                <div className="flex gap-3 mb-4">
                                    <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0" />
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between pb-1">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{agencies.length} Results found</h2>
                            <div className="flex items-center gap-1 text-primary text-sm font-medium cursor-pointer">
                                <span>Sort by: Recommended</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </div>
                        </div>

                        {agencies.length > 0 ? agencies.map((agency) => (
                            <Link
                                key={agency.id}
                                to={`/agency/${agency.id}`}
                                className="group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-slate-100 dark:border-transparent hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start gap-3 mb-3">
                                    <div className="flex gap-3">
                                        <div className="relative w-14 h-14 shrink-0">
                                            {agency.logo_url ? (
                                                <img
                                                    alt={agency.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    src={agency.logo_url}
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-xl">
                                                    {agency.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                </div>
                                            )}
                                            {agency.is_pro && (
                                                <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-white dark:border-card-dark">PRO</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-tight mb-1 text-slate-900 dark:text-white">{agency.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-[16px] text-amber-400 filled">star</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{agency.rating}</span>
                                                <span>({agency.review_count})</span>
                                                <span className="mx-1">•</span>
                                                <span>{agency.location?.city || 'Worldwide'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => e.preventDefault()}
                                        className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">favorite</span>
                                    </button>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                                    {agency.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {agency.tags && agency.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Starting from</span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            ${agency.pricing?.starting_monthly >= 1000 ? `${(agency.pricing.starting_monthly / 1000).toFixed(1)}k` : agency.pricing?.starting_monthly || '500'}
                                            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/mo</span>
                                        </span>
                                    </div>
                                    {agency.is_registered ? (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                navigate(`/chat/${agency.id}`)
                                            }}
                                            className="bg-primary hover:bg-blue-600 text-white text-sm font-semibold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-primary/20"
                                        >
                                            Contact Firm
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => e.preventDefault()}
                                            className="bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-400 text-sm font-semibold py-2 px-6 rounded-lg transition-colors"
                                        >
                                            View Profile
                                        </button>
                                    )}
                                </div>
                            </Link>
                        )) : (
                            <div className="text-center py-10">
                                <p className="text-slate-500">No agencies found matching your criteria.</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            <BottomNav />
        </MobileContainer>
    )
}
