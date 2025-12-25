import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { mockAgencies, mockReviews } from '../data/mockAgencies'

export default function ReviewsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState('All')

    const agency = mockAgencies.find(a => a.id === id) || mockAgencies[0]
    const reviews = mockReviews.filter(r => r.agency_id === id || r.agency_id === agency.id)

    const ratingDistribution = {
        5: 70,
        4: 18,
        3: 5,
        2: 2,
        1: 5
    }

    const filters = ['All', '5 Stars', 'Latest', 'With Photos']

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-[#111318] shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center bg-white/90 dark:bg-[#111318]/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
                <div
                    onClick={() => navigate(-1)}
                    className="cursor-pointer text-gray-900 dark:text-white flex size-12 shrink-0 items-center justify-start hover:opacity-70 transition-opacity"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios</span>
                </div>
                <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Reviews</h2>
                <div className="flex w-12 items-center justify-end absolute right-4 top-4">
                    <button className="flex items-center justify-center rounded-lg size-10 bg-transparent text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="material-symbols-outlined text-[24px]">tune</span>
                    </button>
                </div>
            </div>

            <main className="flex-1 pb-24">
                {/* Rating Summary */}
                <div className="flex flex-col p-5 bg-white dark:bg-[#111318]">
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        <div className="flex flex-col gap-1 items-center justify-center min-w-[100px]">
                            <p className="text-gray-900 dark:text-white text-5xl font-black leading-tight tracking-[-0.033em]">{agency.rating}</p>
                            <div className="flex gap-0.5 text-yellow-400">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className={`material-symbols-outlined ${i <= Math.floor(agency.rating) ? 'filled' : ''}`} style={{ fontSize: '18px' }}>
                                        {i <= agency.rating ? 'star' : agency.rating >= i - 0.5 ? 'star_half' : 'star'}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">{agency.review_count} reviews</p>
                        </div>
                        <div className="grid flex-1 grid-cols-[12px_1fr_30px] items-center gap-y-2 gap-x-3">
                            {[5, 4, 3, 2, 1].map(rating => (
                                <React.Fragment key={rating}>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs font-semibold leading-normal">{rating}</p>
                                    <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-[#3b4354]">
                                        <div className="rounded-full bg-primary" style={{ width: `${ratingDistribution[rating]}%` }} />
                                    </div>
                                    <p className="text-gray-400 dark:text-[#9da6b9] text-xs font-normal leading-normal text-right">{ratingDistribution[rating]}%</p>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-gray-200 dark:bg-gray-800 my-2" />

                {/* Filter Chips */}
                <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar touch-pan-x">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors ${activeFilter === filter
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-[#282e39] text-gray-900 dark:text-white border border-gray-200 dark:border-transparent hover:bg-gray-200 dark:hover:bg-[#343b48]'
                                }`}
                        >
                            <p className="text-sm font-medium leading-normal">{filter}</p>
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                <div className="flex flex-col gap-6 p-4">
                    {reviews.map((review, idx) => (
                        <div key={review.id || idx}>
                            <div className="flex flex-col gap-3 bg-white dark:bg-[#111318] rounded-xl">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-gray-100 dark:ring-gray-800 bg-gradient-to-br from-primary/30 to-purple-500/30"
                                            style={review.user_avatar ? { backgroundImage: `url("${review.user_avatar}")` } : {}}
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-gray-900 dark:text-white text-base font-semibold leading-tight">{review.user_name}</p>
                                            <p className="text-gray-500 dark:text-[#9da6b9] text-xs font-normal">
                                                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    {review.service_tag && (
                                        <div className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {review.service_tag}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1 text-yellow-400 mt-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <span
                                            key={i}
                                            className={`material-symbols-outlined ${i <= review.rating ? 'filled text-yellow-400' : 'text-gray-300 dark:text-[#556077]'}`}
                                            style={{ fontSize: '18px' }}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-200 text-sm font-normal leading-relaxed">
                                    {review.text}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex gap-6 text-gray-400 dark:text-[#9da6b9]">
                                        <button className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '18px' }}>thumb_up</span>
                                            <p className="text-xs font-medium">{review.helpful_count}</p>
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors group">
                                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: '18px' }}>thumb_down</span>
                                        </button>
                                    </div>
                                    <button className="text-primary text-xs font-semibold hover:underline">Reply</button>
                                </div>
                            </div>
                            {idx < reviews.length - 1 && <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mt-6" />}
                        </div>
                    ))}
                </div>
            </main>

            {/* Fixed Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-[#111318] dark:via-[#111318] dark:to-transparent z-40 pb-6 pt-12">
                <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined mr-2" style={{ fontSize: '20px' }}>edit</span>
                    <span className="truncate">Write a Review</span>
                </button>
            </div>
        </div>
    )
}
