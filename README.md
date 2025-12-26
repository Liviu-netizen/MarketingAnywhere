# NowMarketing

A mobile-first marketing agency discovery platform. Find, compare, and chat with marketing agencies near you.

## Features

- Search marketing agencies by location and category (OpenStreetMap)
- Compare agencies by ratings, reviews, and pricing
- In-app chat with registered agencies
- Side-by-side price comparison
- Mobile-first design with Android support

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Real-time)
- **APIs**: OpenStreetMap (Nominatim + Overpass via `/api/places`)
- **Mobile**: Capacitor for Android

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase keys and Places settings
# For live places in local dev, set VITE_PLACES_API_URL or run vercel dev

# Run development server
npm run dev
```

## Android Build

```bash
npm run build
npm run cap:add:android  # First time only
npm run cap:sync
npm run cap:open:android
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_PLACES_API_URL` | Optional base URL for `/api/places` (leave empty for same-origin) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for `/api/places` upserts |
| `PLACES_USER_AGENT` | Required User-Agent for Nominatim/Overpass |
| `PLACES_EMAIL` | Contact email for Nominatim usage |
| `PLACES_OVERPASS_URL` | Optional Overpass endpoint override |
| `PLACES_NOMINATIM_URL` | Optional Nominatim endpoint override |
| `PLACES_CACHE_TTL_MS` | Cache TTL for places lookups |


## License

MIT

