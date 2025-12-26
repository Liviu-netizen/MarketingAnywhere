import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAgencyById, getAgencyReviews } from '../lib/supabase'

export default function AgencyProfilePage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [agency, setAgency] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const [{ data: agencyData }, { data: reviewsData }] = await Promise.all([
                getAgencyById(id),
                getAgencyReviews(id)
            ])
            if (agencyData) setAgency(agencyData)
            if (reviewsData) setReviews(reviewsData)
            setLoading(false)
        }
        loadData()
    }, [id])

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    if (!agency) return (
        <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark">
            <p className="text-gray-500 font-bold mb-4">Agency not found</p>
            <button onClick={() => navigate(-1)} className="text-primary font-bold">Go Back</button>
        </div>
    )

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-light/85 dark:bg-background-dark/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
                </button>
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Agency Profile</h2>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">favorite_border</span>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">share</span>
                    </button>
                </div>
            </header>

            {/* Profile Hero */}
            <section className="flex flex-col items-center pt-8 px-4 w-full">
                <div className="relative mb-4">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 shadow-xl ring-4 ring-white dark:ring-slate-800 bg-gradient-to-br from-primary/30 to-purple-500/30"
                        style={agency.logo_url ? { backgroundImage: `url("${agency.logo_url}")` } : {}}
                    />
                    {agency.verified && (
                        <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 border-4 border-background-light dark:border-background-dark flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                        </div>
                    )}
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-1">{agency.name}</h1>
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm mb-2">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span>{agency.location?.city || 'Worldwide'}{agency.location?.country ? `, ${agency.location.country}` : ''}</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px] text-yellow-500 filled">star</span>
                        <span className="font-medium text-slate-900 dark:text-white">{agency.rating}</span>
                        <span>({agency.review_count} Reviews)</span>
                    </div>
                </div>
            </section>

            {/* Tags */}
            <section className="flex flex-wrap justify-center gap-2 px-4 mt-6">
                {agency.verified && (
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800 px-3 py-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Verified Agency</p>
                    </div>
                )}
                <div className="flex items-center gap-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800 px-3 py-1.5">
                    <span className="material-symbols-outlined text-[16px] text-green-500">attach_money</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Budget: {agency.budget_level || '$$'}</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800 px-3 py-1.5">
                    <span className="material-symbols-outlined text-[16px] text-purple-500">computer</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Focus: {agency.focus || 'General'}</p>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="grid grid-cols-2 gap-3 px-4 mt-6">
                <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1c2333] p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg RoAS</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{agency.stats?.avg_roas || 'N/A'}</p>
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-[#1c2333] p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-xl">history</span>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Experience</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{agency.stats?.years_experience || '0'}+ Years</p>
                </div>
            </section>

            {/* About */}
            <section className="px-4 mt-6">
                <details className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2333] open:ring-1 open:ring-primary/20 shadow-sm transition-all duration-300" open>
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-[20px]">info</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">About Us</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="px-4 pb-4 pt-0">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 pl-[44px]">
                            {agency.description}
                        </p>
                    </div>
                </details>
            </section>

            {/* Services */}
            <section className="mt-8">
                <div className="flex items-center justify-between px-4 mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Services Offered</h3>
                    <a className="text-xs font-medium text-primary hover:text-primary/80" href="#">See All</a>
                </div>
                <div className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar snap-x">
                    {agency.services && agency.services.length > 0 ? agency.services.map((service, idx) => (
                        <div key={idx} className="flex-none w-[160px] snap-center flex flex-col gap-3 rounded-xl bg-white dark:bg-[#1c2333] p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className={`size-10 rounded-lg ${['bg-blue-50 dark:bg-blue-900/20 text-primary', 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'][idx % 3]} flex items-center justify-center`}>
                                <span className="material-symbols-outlined">{['search', 'campaign', 'ads_click'][idx % 3]}</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{service.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{service.description}</p>
                            </div>
                            <div className="mt-auto pt-2">
                                <span className="text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">From ${(service.price_from / 1000).toFixed(0)}k/mo</span>
                            </div>
                        </div>
                    )) : (
                        <p className="px-4 text-xs text-slate-500 italic">No services listed.</p>
                    )}
                </div>
            </section>

            {/* Reviews Preview */}
            <section className="mt-4 px-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Client Reviews</h3>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <span className="text-sm font-medium">{agency.rating}</span>
                        <span className="material-symbols-outlined text-[16px] text-yellow-500 filled">star</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {reviews.length > 0 ? (
                        <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-[#1c2333] border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="shrink-0">
                                <div
                                    className="h-10 w-10 rounded-full bg-cover bg-center bg-gradient-to-br from-primary/30 to-purple-500/30"
                                    style={reviews[0].profiles?.avatar_url ? { backgroundImage: `url("${reviews[0].profiles.avatar_url}")` } : {}}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{reviews[0].profiles?.full_name || reviews[0].user_name || 'Recent Client'}</h5>
                                    <span className="text-xs text-slate-400">{new Date(reviews[0].created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span key={i} className={`material-symbols-outlined text-[14px] text-yellow-500 ${i <= reviews[0].rating ? 'filled' : ''}`}>star</span>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-normal">
                                    {reviews[0].text}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic px-4">No reviews yet.</p>
                    )}
                    <Link
                        to={`/agency/${id}/reviews`}
                        className="w-full py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-center block"
                    >
                        View all {agency.review_count} reviews
                    </Link>
                </div>
            </section>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex gap-3 z-50 safe-area-bottom">
                <Link
                    to={`/agency/${id}/pricing`}
                    className="flex-1 flex items-center justify-center h-12 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 transform duration-100"
                >
                    View Pricing
                </Link>
                {agency.is_registered ? (
                    <Link
                        to={`/chat/${id}`}
                        className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 active:scale-95 transform duration-100"
                    >
                        <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        Contact Firm
                    </Link>
                ) : (
                    <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-[2] h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 active:scale-95 transform duration-100"
                    >
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        Visit Website
                    </a>
                )}
            </div>
        </div>
    )
}
