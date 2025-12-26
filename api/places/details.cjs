const { createClient } = require('@supabase/supabase-js');
const {
  OVERPASS_URL,
  fetchJson,
  reverseGeocode,
  mapElementToAgency
} = require('./_shared.cjs');

const UUID_REGEX = /^[0-9a-f-]{36}$/i;

const parseOsmId = (value) => {
  if (!value) return null;
  const cleaned = value.startsWith('osm:') ? value.slice(4) : value;
  const [type, id] = cleaned.split('/');
  if (!type || !id) return null;
  return { type, id };
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
  const rawId = params.id ? String(params.id) : '';

  if (!rawId) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (UUID_REGEX.test(rawId) && supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    const { data } = await supabase.from('agencies').select('*').eq('id', rawId).single();
    if (data) {
      res.status(200).json({ data });
      return;
    }
  }

  const parsed = parseOsmId(rawId);
  if (!parsed) {
    res.status(400).json({ error: 'Unsupported id format' });
    return;
  }

  const overpassQuery = `[out:json][timeout:25];${parsed.type}(${parsed.id});out center tags;`;
  const overpassData = await fetchJson(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(overpassQuery)}`
  });

  const element = Array.isArray(overpassData.elements) ? overpassData.elements[0] : null;
  if (!element) {
    res.status(404).json({ error: 'Place not found' });
    return;
  }

  const lat = element.lat ?? element.center?.lat ?? null;
  const lng = element.lon ?? element.center?.lon ?? null;
  const hint = await reverseGeocode(lat, lng);
  const agency = mapElementToAgency(element, hint, { center: { lat, lng } });

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    const location = { ...(agency.location || {}) };
    delete location.distance_km;
    await supabase.from('agencies').upsert([{ ...agency, location }], {
      onConflict: 'google_place_id',
      ignoreDuplicates: true
    });
  }

  res.status(200).json({ data: agency });
};
