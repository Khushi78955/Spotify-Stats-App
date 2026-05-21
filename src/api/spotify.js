import { getValidToken, logout } from '../auth/SpotifyAuth';

const BASE = 'https://api.spotify.com/v1';

async function request(path, params = {}) {
  const token = await getValidToken();
  if (!token) {
    logout();
    throw new Error('Not authenticated');
  }

  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') || '2');
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return request(path, params);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  return res.json();
}

export async function getUserProfile() {
  return request('/me');
}

export async function getTopTracks(timeRange = 'medium_term', limit = 50) {
  return request('/me/top/tracks', { time_range: timeRange, limit });
}

export async function getTopArtists(timeRange = 'medium_term', limit = 50) {
  return request('/me/top/artists', { time_range: timeRange, limit });
}

export async function getRecentlyPlayed(limit = 50) {
  return request('/me/player/recently-played', { limit });
}

// Requires extended quota access on newer Spotify apps (registered after Nov 2023).
// Returns { audio_features: [...] } or throws on 403/error.
export async function getAudioFeatures(trackIds) {
  if (!trackIds?.length) return { audio_features: [] };
  const ids = trackIds.slice(0, 100).join(',');
  return request('/audio-features', { ids });
}

// Returns the currently playing track, or null if nothing is playing / not available.
export async function getCurrentlyPlaying() {
  try {
    const token = await getValidToken();
    if (!token) return null;
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204 || !res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Paginates recently-played using cursor to collect up to maxItems tracks.
export async function getRecentlyPlayedBatch(maxItems = 200) {
  const items = [];
  let before = null;

  while (items.length < maxItems) {
    const params = { limit: 50 };
    if (before) params.before = before;

    const data = await request('/me/player/recently-played', params);
    items.push(...(data.items || []));

    const nextCursor = data.cursors?.before;
    if (!nextCursor || (data.items?.length ?? 0) < 50) break;
    before = nextCursor;
  }

  return { items: items.slice(0, maxItems) };
}
