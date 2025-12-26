import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAgencyById, getMessages, getOrCreateConversation, sendMessage as sendSupabaseMessage, subscribeToMessages } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function ChatPage() {
    const { agencyId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const messagesEndRef = useRef(null)
    const [message, setMessage] = useState('')
    const [agency, setAgency] = useState(null)
    const [messages, setMessages] = useState([])
    const [conversationId, setConversationId] = useState(null)
    const [loading, setLoading] = useState(true)

    const formatMessage = (messageData) => ({
        id: messageData.id,
        senderId: messageData.sender_id,
        text: messageData.content,
        time: new Date(messageData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    useEffect(() => {
        let subscription

        async function loadChat() {
            if (!agencyId) return
            setLoading(true)

            const { data: agencyData } = await getAgencyById(agencyId)
            setAgency(agencyData)

            if (agencyData?.is_registered && user) {
                const { data: conversation } = await getOrCreateConversation(user.id, agencyId)
                if (conversation) {
                    setConversationId(conversation.id)
                    const { data: messagesData } = await getMessages(conversation.id)
                    if (messagesData) {
                        setMessages(messagesData.map(formatMessage))
                    }
                    subscription = subscribeToMessages(conversation.id, (payload) => {
                        if (payload?.new) {
                            setMessages((prev) => {
                                if (prev.some((msg) => msg.id === payload.new.id)) return prev
                                return [...prev, formatMessage(payload.new)]
                            })
                        }
                    })
                }
            }

            setLoading(false)
        }

        loadChat()

        return () => {
            if (subscription) subscription.unsubscribe()
        }
    }, [agencyId, user])

    // Check if agency is registered for in-app chat
    const isRegistered = agency?.is_registered

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!message.trim() || !user || !agencyId || !conversationId) return

        const { data } = await sendSupabaseMessage(conversationId, message.trim(), user.id)

        if (data) {
            setMessages((prev) => {
                if (prev.some((msg) => msg.id === data.id)) return prev
                return [...prev, formatMessage(data)]
            })
            setMessage('')
        }
    }

    // If agency not registered, show redirect
    if (agency && !isRegistered) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-slate-500">link_off</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{agency.name} isn't on NowMarketing yet</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        This agency hasn't registered for in-app messaging. You can visit their website to get in touch.
                    </p>
                    <a
                        href={agency.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 hover:bg-blue-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                        Visit Website
                    </a>
                    <button
                        onClick={() => navigate(-1)}
                        className="block w-full mt-4 text-primary font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!loading && !agency) {
        return (
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
                <div className="text-center max-w-sm">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Agency not found</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="block w-full mt-4 text-primary font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
                </button>
                {agency && (
                    <div className="flex items-center gap-3 flex-1">
                        <div
                            className="w-10 h-10 rounded-full bg-cover bg-center bg-gradient-to-br from-primary/30 to-purple-500/30"
                            style={agency.logo_url ? { backgroundImage: `url("${agency.logo_url}")` } : {}}
                        />
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white">{agency.name}</h2>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                Online
                            </p>
                        </div>
                    </div>
                )}
                <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">more_vert</span>
                </button>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.senderId === user?.id
                                ? 'bg-primary text-white rounded-br-sm'
                                : 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700'
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.senderId === user?.id ? 'text-white/70' : 'text-slate-400'}`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            {/* Message Input */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 safe-area-bottom">
                <div className="flex items-center gap-3 max-w-md mx-auto">
                    <button className="flex items-center justify-center w-10 h-10 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">attach_file</span>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type a message..."
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white disabled:opacity-50 transition-opacity"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
