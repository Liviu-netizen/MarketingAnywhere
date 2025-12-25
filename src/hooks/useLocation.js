import { useState } from 'react'

export default function useLocation() {
    const [location, setLocation] = useState({
        city: 'New York',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        loading: false,
        error: null
    })

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: 'Geolocation not supported' }))
            return
        }

        setLocation(prev => ({ ...prev, loading: true }))

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords

                // In production, reverse geocode to get city name
                setLocation({
                    city: 'Current Location',
                    country: '',
                    lat: latitude,
                    lng: longitude,
                    loading: false,
                    error: null
                })
            },
            (error) => {
                setLocation(prev => ({ ...prev, loading: false, error: error.message }))
            }
        )
    }

    return { location, requestLocation }
}
