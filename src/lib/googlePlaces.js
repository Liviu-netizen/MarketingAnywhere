// Google Places API wrapper for marketing agency discovery
// Note: In production, API calls should go through your backend to protect API keys

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || ''

// For development, we'll use mock data. In production, these would call the actual API.
const USE_MOCK_DATA = !GOOGLE_PLACES_API_KEY

// Search for marketing agencies near a location
export const searchMarketingAgencies = async (location, options = {}) => {
    if (USE_MOCK_DATA) {
        // Return mock data for development
        const { mockAgencies } = await import('../data/mockAgencies')
        return { data: mockAgencies, error: null }
    }

    try {
        // In production, this should call your backend which then calls Google Places API
        const response = await fetch(`/api/places/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: 'marketing agency',
                location,
                radius: options.radius || 50000, // 50km default
                type: 'marketing_agency'
            })
        })

        const data = await response.json()
        return { data: data.results, error: null }
    } catch (error) {
        console.error('Google Places API error:', error)
        return { data: null, error }
    }
}

// Get place details including reviews
export const getPlaceDetails = async (placeId) => {
    if (USE_MOCK_DATA) {
        const { mockAgencies } = await import('../data/mockAgencies')
        const agency = mockAgencies.find(a => a.id === placeId || a.google_place_id === placeId)
        return { data: agency, error: null }
    }

    try {
        const response = await fetch(`/api/places/details/${placeId}`)
        const data = await response.json()
        return { data: data.result, error: null }
    } catch (error) {
        console.error('Google Places API error:', error)
        return { data: null, error }
    }
}

// Get photo URL from Google Places photo reference
export const getPlacePhotoUrl = (photoReference, maxWidth = 400) => {
    if (!photoReference || USE_MOCK_DATA) return null
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

const toRad = (deg) => deg * (Math.PI / 180)

// Format distance for display
export const formatDistance = (km) => {
    if (km < 1) return `${Math.round(km * 1000)}m`
    return `${km.toFixed(1)}km`
}

// Geocode an address to coordinates
export const geocodeAddress = async (address) => {
    if (USE_MOCK_DATA) {
        // Return mock NYC coordinates
        return {
            data: { lat: 40.7128, lng: -74.0060, formatted_address: 'New York, NY, USA' },
            error: null
        }
    }

    try {
        const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
        const data = await response.json()
        return { data: data.results[0], error: null }
    } catch (error) {
        console.error('Geocoding error:', error)
        return { data: null, error }
    }
}
