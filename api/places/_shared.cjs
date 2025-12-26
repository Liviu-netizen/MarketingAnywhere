const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060, city: 'New York', country: 'USA' };
const OVERPASS_URL = process.env.PLACES_OVERPASS_URL || 'https://overpass-api.de/api/interpreter';
const NOMINATIM_URL = process.env.PLACES_NOMINATIM_URL || 'https://nominatim.openstreetmap.org';
const CACHE_TTL_MS = Number.parseInt(process.env.PLACES_CACHE_TTL_MS || '600000', 10);

const cache = globalThis.__nowmarketingPlacesCache || (globalThis.__nowmarketingPlacesCache = new Map());

const GENERIC_TOKENS = new Set([
  'marketing',
  'agency',
  'agencies',
  'advertising',
  'ads',
  'ad',
  'digital',
  'branding',
  'seo',
  'ppc',
  'social',
  'media',
  'pr',
  'public',
  'relations',
  'consulting',
  'services',
  'service'
]);

const CATEGORY_KEYWORDS = {
  seo: ['seo', 'search', 'optimization'],
  ads: ['ads', 'advertising', 'ppc', 'paid'],
  design: ['design', 'branding', 'creative'],
  social: ['social', 'community', 'influencer'],
  email: ['email', 'crm', 'automation'],
  dev: ['web', 'development', 'software'],
  video: ['video', 'production']
};

const getUserAgent = () => {
  return process.env.PLACES_USER_AGENT || 'NowMarketing/1.0';
};

const buildHeaders = (extra = {}) => {
  return {
    'User-Agent': getUserAgent(),
    'Accept': 'application/json',
    ...extra
  };
};

const getCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCache = (key, value, ttlMs = CACHE_TTL_MS) => {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers || {})
  });
  if (!response.ok) {
    const message = await response.text();
    const error = new Error(`Places API request failed: ${response.status}`);
    error.details = message;
    throw error;
  }
  return response.json();
};

const geocodeLocation = async (query) => {
  if (!query) return { ...DEFAULT_CENTER };
  const cacheKey = `geocode:${query}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = `${NOMINATIM_URL}/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`;
  const results = await fetchJson(url);
  if (!Array.isArray(results) || results.length === 0) {
    return { ...DEFAULT_CENTER };
  }
  const item = results[0];
  const address = item.address || {};
  const location = {
    lat: Number.parseFloat(item.lat),
    lng: Number.parseFloat(item.lon),
    city: address.city || address.town || address.village || address.county || address.state || '',
    country: address.country || '',
    display_name: item.display_name || query
  };
  setCache(cacheKey, location);
  return location;
};

const reverseGeocode = async (lat, lng) => {
  if (lat == null || lng == null) return { city: '', country: '' };
  const cacheKey = `reverse:${lat}:${lng}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const url = `${NOMINATIM_URL}/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const result = await fetchJson(url);
  const address = result.address || {};
  const location = {
    city: address.city || address.town || address.village || address.county || address.state || '',
    country: address.country || ''
  };
  setCache(cacheKey, location);
  return location;
};

const buildOverpassQuery = (lat, lng, radiusMeters) => {
  const around = `around:${radiusMeters},${lat},${lng}`;
  return `[out:json][timeout:25];
(
  node["office"~"advertising|marketing|public_relations|company"](${around});
  way["office"~"advertising|marketing|public_relations|company"](${around});
  relation["office"~"advertising|marketing|public_relations|company"](${around});
  node["shop"="advertising"](${around});
  way["shop"="advertising"](${around});
  relation["shop"="advertising"](${around});
);
out center tags;`;
};

const toTitleCase = (value) => {
  if (!value) return value;
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const extractAddress = (tags, hint) => {
  const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ').trim();
  const city = tags['addr:city'] || hint.city || '';
  const country = tags['addr:country'] || hint.country || '';
  const postcode = tags['addr:postcode'] || '';
  const addressParts = [street, city, postcode, country].filter(Boolean);
  return {
    address: addressParts.join(', ') || hint.display_name || '',
    city,
    country
  };
};

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
};

const mapElementToAgency = (element, hint, options = {}) => {
  const tags = element.tags || {};
  const lat = element.lat ?? element.center?.lat ?? null;
  const lng = element.lon ?? element.center?.lon ?? null;
  const { address, city, country } = extractAddress(tags, hint);
  const name = tags.name || tags.brand || tags.operator || tags['official_name'] || 'Marketing Agency';

  const tagSet = new Set();
  if (tags.office) tagSet.add(tags.office);
  if (tags.shop) tagSet.add(tags.shop);
  if (tags.service) tagSet.add(tags.service);
  if (options.category) tagSet.add(options.category);
  tagSet.add('Marketing');

  const normalizedTags = Array.from(tagSet).map(toTitleCase);
  const website = tags.website || tags['contact:website'] || '';
  const phone = tags.phone || tags['contact:phone'] || '';
  const description = tags.description || tags['description:en'] || tags.note || '';
  const distanceKm = options.center && lat != null && lng != null
    ? haversineKm(options.center.lat, options.center.lng, lat, lng)
    : null;

  return {
    google_place_id: `osm:${element.type}/${element.id}`,
    name,
    logo_url: tags.logo || null,
    cover_image: tags.image || null,
    rating: null,
    review_count: 0,
    location: {
      city: city || '',
      country: country || '',
      address,
      lat,
      lng,
      distance_km: distanceKm
    },
    description: description || (city ? `Marketing agency in ${city}.` : 'Marketing agency'),
    services: [],
    tags: normalizedTags,
    verified: false,
    is_registered: false,
    is_pro: false,
    website: website || null,
    phone: phone || null,
    pricing: {},
    stats: {},
    budget_level: null,
    focus: null
  };
};

const tokenize = (value) => {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
};

const isGenericQuery = (query) => {
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;
  return tokens.every((token) => GENERIC_TOKENS.has(token));
};

const filterByQuery = (agencies, query, category) => {
  if (!query && !category) return agencies;
  const tokens = query ? tokenize(query) : [];
  const categoryTokens = category && CATEGORY_KEYWORDS[category] ? CATEGORY_KEYWORDS[category] : [];

  if (query && isGenericQuery(query) && categoryTokens.length === 0) {
    return agencies;
  }

  return agencies.filter((agency) => {
    const haystack = [
      agency.name,
      agency.description,
      ...(agency.tags || []),
      agency.location?.city,
      agency.location?.country
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesQuery = tokens.length === 0 ? true : tokens.some((token) => haystack.includes(token));
    const matchesCategory = categoryTokens.length === 0
      ? true
      : categoryTokens.some((token) => haystack.includes(token));

    return matchesQuery && matchesCategory;
  });
};

module.exports = {
  DEFAULT_CENTER,
  OVERPASS_URL,
  NOMINATIM_URL,
  CATEGORY_KEYWORDS,
  getCache,
  setCache,
  fetchJson,
  geocodeLocation,
  reverseGeocode,
  buildOverpassQuery,
  mapElementToAgency,
  filterByQuery
};
