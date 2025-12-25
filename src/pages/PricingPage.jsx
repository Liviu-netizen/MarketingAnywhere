import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MobileContainer from '../components/layout/MobileContainer'
import { getAgencyById } from '../lib/supabase'

export default function PricingPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [agency, setAgency] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState('card')
    const [selectedPlan, setSelectedPlan] = useState('Professional')

    useEffect(() => {
        async function loadAgency() {
            const { data } = await getAgencyById(id)
            if (data) setAgency(data)
            setLoading(false)
        }
        loadAgency()
    }, [id])

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-background-light dark:bg-background-dark">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    const packages = [
        {
            id: 'apex-digital-strategies',
            name: 'Apex Digital',
            rating: 4.9,
            reviews: 124,
            price: 1200,
            color: 'blue',
            badge: 'Best Value',
            badgeColor: 'primary',
            features: ['SEO Audit & Optimization', 'Content Creation (4/mo)', 'PPC Management']
        },
        {
            id: 'growth-gurus',
            name: 'Growth Gurus',
            rating: 4.7,
            reviews: 89,
            price: 1500,
            color: 'purple',
            badge: 'Top Rated',
            badgeColor: 'purple-600',
            features: ['Advanced SEO Strategy', 'Social Media Strategy', 'Influencer Outreach']
        },
        {
            id: 'nexgen-media',
            name: 'NexGen Media',
            rating: 4.5,
            reviews: 42,
            price: 900,
            color: 'orange',
            badge: null,
            features: ['Basic SEO Audit', 'Email Marketing', 'Basic Analytics']
        }
    ]

    const comparisonFeatures = [
        { name: 'Content Posts', values: ['4 / mo', '8 / mo', '-'] },
        { name: 'SEO Audit', values: [true, true, true] },
        { name: 'Analytics', values: ['Advanced', 'Advanced', 'Basic'] },
        { name: 'PPC Mgmt', values: [true, true, false] },
        { name: 'Email Marketing', values: ['Add-on', 'Add-on', true] },
        { name: 'Support', values: ['24/7 Chat', 'Dedicated Mgr', 'Email Only'] }
    ]

    const selected = packages.find(p => p.id === selectedAgency) || packages[0]

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center bg-surface-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
                <div
                    onClick={() => navigate(-1)}
                    className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:opacity-70"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Compare Packages</h2>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined text-2xl">tune</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col pb-24">
                {/* View Toggle */}
                <div className="flex px-4 py-4 sticky top-[68px] z-40 bg-background-light dark:bg-background-dark transition-colors duration-200">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-200 dark:bg-[#282e39] p-1">
                        {['card', 'table'].map(mode => (
                            <label
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-[4px] px-2 transition-all duration-200 ${viewMode === mode ? 'bg-white dark:bg-background-dark shadow-sm' : ''}`}
                            >
                                <span className={`truncate text-sm font-semibold leading-normal capitalize ${viewMode === mode ? 'text-primary' : 'text-slate-500 dark:text-[#9da6b9]'}`}>
                                    {mode} View
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Headline */}
                <div className="px-4 pb-2 pt-2 flex justify-between items-end">
                    <h3 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight text-left">{packages.length} Packages</h3>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{currentAgency.location.city} • {currentAgency.tags[0]}</span>
                </div>

                {/* Card View */}
                {viewMode === 'card' && (
                    <div className="w-full overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4 py-4 flex gap-4">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => setSelectedAgency(pkg.id)}
                                className={`snap-center shrink-0 w-[85%] max-w-[320px] flex flex-col gap-4 rounded-xl border ${selectedAgency === pkg.id ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 dark:border-[#3b4354]'} bg-surface-light dark:bg-surface-dark p-5 shadow-sm transition-all duration-200 cursor-pointer`}
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-10 rounded-full bg-${pkg.color}-100 dark:bg-${pkg.color}-900/30 flex items-center justify-center text-${pkg.color === 'blue' ? 'primary' : pkg.color + '-600'} font-bold text-lg`}>
                                                {pkg.name[0]}
                                            </div>
                                            <div>
                                                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">{pkg.name}</h1>
                                                <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                                                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{pkg.rating}</span>
                                                    <span className="text-slate-400 dark:text-slate-500">({pkg.reviews})</span>
                                                </div>
                                            </div>
                                        </div>
                                        {pkg.badge && (
                                            <span className={`text-white text-[10px] font-bold uppercase tracking-wider rounded bg-${pkg.badgeColor} px-2 py-1`}>
                                                {pkg.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-slate-700 w-full my-1" />
                                    <p className="flex items-baseline gap-1 text-slate-900 dark:text-white">
                                        <span className="text-4xl font-black leading-tight tracking-tight">${pkg.price.toLocaleString()}</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm font-bold">/mo</span>
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 my-2">
                                    {pkg.features.map((feature, idx) => (
                                        <div key={idx} className="text-[13px] font-medium leading-normal flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <button className={`mt-auto flex w-full cursor-pointer items-center justify-center rounded-lg h-11 px-4 text-sm font-bold transition-colors ${selectedAgency === pkg.id ? 'bg-primary text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700' : 'bg-slate-200 dark:bg-[#282e39] text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700'}`}>
                                    Book Package
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                    <div className="mt-4 flex flex-col">
                        <div className="px-4 flex items-center justify-between py-2">
                            <h4 className="text-slate-900 dark:text-white font-bold text-lg">Detailed Comparison</h4>
                        </div>
                        <div className="w-full overflow-x-auto border-t border-slate-200 dark:border-[#3b4354]">
                            <div className="min-w-[600px] w-full">
                                {/* Header */}
                                <div className="grid grid-cols-[140px_1fr_1fr_1fr] bg-slate-50 dark:bg-[#15181e]">
                                    <div className="p-3 text-xs font-bold text-slate-500 dark:text-[#9da6b9] uppercase sticky left-0 bg-slate-50 dark:bg-[#15181e] z-10">Feature</div>
                                    {packages.map(pkg => (
                                        <div key={pkg.id} className="p-3 text-xs font-bold text-center text-slate-900 dark:text-white truncate">{pkg.name}</div>
                                    ))}
                                </div>
                                {/* Rows */}
                                <div className="divide-y divide-slate-100 dark:divide-[#2a2f3a] text-sm text-slate-700 dark:text-slate-300">
                                    {comparisonFeatures.map((feature, idx) => (
                                        <div key={idx} className="grid grid-cols-[140px_1fr_1fr_1fr] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <div className="p-3 font-medium flex items-center sticky left-0 bg-background-light dark:bg-background-dark z-10">{feature.name}</div>
                                            {feature.values.map((value, vIdx) => (
                                                <div key={vIdx} className="p-3 text-center flex items-center justify-center">
                                                    {value === true ? (
                                                        <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                                                    ) : value === false ? (
                                                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-600 text-[20px]">close</span>
                                                    ) : value === '-' ? (
                                                        <span className="text-slate-400 dark:text-slate-600">-</span>
                                                    ) : value === 'Add-on' ? (
                                                        <span className="text-slate-500 italic">{value}</span>
                                                    ) : (
                                                        <span className="font-semibold">{value}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Help CTA */}
                <div className="p-4 mt-4">
                    <div className="rounded-xl bg-slate-200 dark:bg-[#1c1f27] p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Not sure which to pick?</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Our marketing experts can help.</span>
                        </div>
                        <button className="bg-white dark:bg-[#282e39] text-slate-900 dark:text-white text-xs font-bold py-2 px-3 rounded-lg shadow-sm border border-slate-200 dark:border-transparent">
                            Chat now
                        </button>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-surface-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 p-4 pb-6 flex items-center justify-between z-50 safe-area-bottom">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Selected: {selected.name}</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                        ${selected.price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span>
                    </span>
                </div>
                <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-transform">
                    <span>Continue</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>
        </div>
    )
}
