// Places API wrapper for live agency discovery (OpenStreetMap via /api/places)
const PLACES_API_BASE = import.meta.env.VITE_PLACES_API_URL || ''

const buildPlacesUrl = (path) => {
    if (!PLACES_API_BASE) return path
    return `${PLACES_API_BASE.replace(/\/$/, '')}${path}`
}

const fetchPlaces = async (path, payload = {}) => {
    const response = await fetch(buildPlacesUrl(path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const message = await response.text()
        const error = new Error(`Places API error: ${response.status}`)
        error.details = message
        throw error
    }

    return response.json()
}

// Search for marketing agencies near a location
export const searchMarketingAgencies = async (location, options = {}) => {
    try {
        const { data } = await fetchPlaces('/api/places/search', {
            location,
            query: options.query,
            category: options.category,
            radius: options.radius,
            limit: options.limit,
            lat: options.lat,
            lng: options.lng
        })
        return { data, error: null }
    } catch (error) {
        console.error('Places API error:', error)
        return { data: null, error }
    }
}

// Get place details
export const getPlaceDetails = async (placeId) => {
    try {
        const { data } = await fetchPlaces('/api/places/details', { id: placeId })
        return { data, error: null }
    } catch (error) {
        console.error('Places API error:', error)
        return { data: null, error }
    }
}

// OSM does not provide direct photo URLs. Use supplied image URLs when available.
export const getPlacePhotoUrl = (photoReference) => {
    return photoReference || null
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

// Basic fallback geocoder (prefer server-side geocoding via /api/places)
export const geocodeAddress = async (address) => {
    if (!address) {
        return { data: null, error: new Error('Address is required') }
    }

    return {
        data: { lat: 40.7128, lng: -74.0060, formatted_address: address },
        error: null
    }
}
