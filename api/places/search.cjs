const { createClient } = require('@supabase/supabase-js');
const {
  DEFAULT_CENTER,
  OVERPASS_URL,
  getCache,
  setCache,
  fetchJson,
  geocodeLocation,
  buildOverpassQuery,
  mapElementToAgency,
  filterByQuery
} = require('./_shared.cjs');

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.method === 'POST'
    ? (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}))
    : {};
  const params = { ...(req.query || {}), ...body };

  const query = String(params.query || params.q || '').trim();
  const locationQuery = String(params.location || params.city || '').trim();
  const category = params.category ? String(params.category) : '';
  const minRating = params.minRating != null ? Number.parseFloat(params.minRating) : null;

  const radius = Math.min(
    Math.max(Number.parseInt(params.radius || '50000', 10) || 50000, 1000),
    100000
  );
  const limit = Math.min(Number.parseInt(params.limit || '30', 10) || 30, 50);

  const lat = toNumber(params.lat);
  const lng = toNumber(params.lng);
  const hasCoords = lat != null && lng != null;

  const cacheKey = JSON.stringify({
    query,
    locationQuery,
    category,
    minRating,
    radius,
    limit,
    lat: hasCoords ? lat : null,
    lng: hasCoords ? lng : null
  });

  const cached = getCache(cacheKey);
  if (cached) {
    res.status(200).json({ data: cached, cached: true });
    return;
  }

  let center = { ...DEFAULT_CENTER };
  if (hasCoords) {
    center = { ...DEFAULT_CENTER, lat, lng };
  } else if (locationQuery) {
    center = await geocodeLocation(locationQuery);
  }

  const overpassQuery = buildOverpassQuery(center.lat, center.lng, radius);
  const overpassData = await fetchJson(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(overpassQuery)}`
  });

  const elements = Array.isArray(overpassData.elements) ? overpassData.elements : [];
  const agencies = elements
    .map((element) => mapElementToAgency(element, center, { center, category }))
    .filter((agency) => agency.name);

  const filtered = filterByQuery(agencies, query, category);
  const ratingFiltered = minRating != null
    ? filtered.filter((agency) => (agency.rating || 0) >= minRating)
    : filtered;

  const sorted = ratingFiltered.sort((a, b) => {
    const distA = a.location?.distance_km ?? Number.POSITIVE_INFINITY;
    const distB = b.location?.distance_km ?? Number.POSITIVE_INFINITY;
    return distA - distB;
  });

  let output = sorted.slice(0, limit);

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseServiceKey && output.length > 0) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    const now = new Date().toISOString();
    const distances = new Map(output.map((agency) => [agency.google_place_id, agency.location?.distance_km ?? null]));
    const rows = output.map((agency) => {
      const location = { ...(agency.location || {}) };
      delete location.distance_km;
      return { ...agency, location, updated_at: now };
    });

    await supabase.from('agencies').upsert(rows, { onConflict: 'google_place_id', ignoreDuplicates: true });

    const externalIds = output.map((agency) => agency.google_place_id);
    const { data } = await supabase.from('agencies').select('*').in('google_place_id', externalIds);
    if (data) {
      const byExternalId = new Map(data.map((row) => [row.google_place_id, row]));
      output = externalIds
        .map((id) => byExternalId.get(id))
        .filter(Boolean)
        .map((row) => {
          const distance = distances.get(row.google_place_id);
          if (distance == null) return row;
          return { ...row, location: { ...(row.location || {}), distance_km: distance } };
        });
    }
  }

  setCache(cacheKey, output);
  res.status(200).json({ data: output, cached: false });
};
