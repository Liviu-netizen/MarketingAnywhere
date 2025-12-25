import { createClient } from '@supabase/supabase-js'

// These will be replaced with real values from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: userData
        }
    })
    return { data, error }
}

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    })
    return { data, error }
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Database helpers for agencies
export const getAgencies = async (filters = {}) => {
    let query = supabase
        .from('agencies')
        .select('*')
        .eq('is_active', true)

    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters.category) {
        query = query.contains('services', [filters.category])
    }
    if (filters.minRating) {
        query = query.gte('rating', filters.minRating)
    }

    const { data, error } = await query.order('rating', { ascending: false })
    return { data, error }
}

export const getAgencyById = async (id) => {
    const { data, error } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

export const getAgencyReviews = async (agencyId) => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, avatar_url)')
        .eq('agency_id', agencyId)
        .order('created_at', { ascending: false })
    return { data, error }
}

// Chat / Messaging
export const getConversations = async (userId) => {
    const { data, error } = await supabase
        .from('conversations')
        .select('*, agencies(name, logo_url), messages(content, created_at)')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
    return { data, error }
}

export const getMessages = async (conversationId) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
    return { data, error }
}

export const sendMessage = async (conversationId, content, senderId) => {
    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            content,
            sender_id: senderId
        })
        .select()
        .single()
    return { data, error }
}

export const subscribeToMessages = (conversationId, callback) => {
    return supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
            callback
        )
        .subscribe()
}

// Saved agencies
export const getSavedAgencies = async (userId) => {
    const { data, error } = await supabase
        .from('saved_agencies')
        .select('*, agencies(*)')
        .eq('user_id', userId)
    return { data, error }
}

export const saveAgency = async (userId, agencyId) => {
    const { data, error } = await supabase
        .from('saved_agencies')
        .insert({ user_id: userId, agency_id: agencyId })
        .select()
    return { data, error }
}

export const unsaveAgency = async (userId, agencyId) => {
    const { error } = await supabase
        .from('saved_agencies')
        .delete()
        .eq('user_id', userId)
        .eq('agency_id', agencyId)
    return { error }
}

// Bookings
export const createBooking = async (booking) => {
    const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single()
    return { data, error }
}

export const getUserBookings = async (userId) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*, agencies(name, logo_url)')
        .eq('user_id', userId)
        .order('scheduled_at', { ascending: true })
    return { data, error }
}
