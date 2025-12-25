# NowMarketing

A mobile-first marketing agency discovery platform. Find, compare, and chat with marketing agencies near you.

## Features

- 🔍 Search marketing agencies by location and category
- ⭐ Compare agencies by ratings, reviews, and pricing
- 💬 In-app chat with registered agencies
- 📊 Side-by-side price comparison
- 📱 Mobile-first design with Android support

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Real-time)
- **APIs**: Google Places API
- **Mobile**: Capacitor for Android

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Google Places API keys

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
| `VITE_GOOGLE_PLACES_API_KEY` | Google Places API key |

## License

MIT
