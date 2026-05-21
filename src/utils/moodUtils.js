import { categorizeGenre } from './genreUtils';

const MOOD_WEIGHTS = {
  pop:        { energy: 0.70, happiness: 0.80, danceability: 0.75 },
  electronic: { energy: 0.90, happiness: 0.60, danceability: 0.85 },
  hiphop:     { energy: 0.80, happiness: 0.65, danceability: 0.90 },
  rock:       { energy: 0.85, happiness: 0.50, danceability: 0.60 },
  indie:      { energy: 0.55, happiness: 0.60, danceability: 0.55 },
  classical:  { energy: 0.30, happiness: 0.55, danceability: 0.20 },
  jazz:       { energy: 0.45, happiness: 0.65, danceability: 0.50 },
  rnb:        { energy: 0.60, happiness: 0.70, danceability: 0.80 },
  country:    { energy: 0.55, happiness: 0.65, danceability: 0.55 },
  latin:      { energy: 0.80, happiness: 0.75, danceability: 0.88 },
  chill:      { energy: 0.25, happiness: 0.60, danceability: 0.30 },
  other:      { energy: 0.55, happiness: 0.55, danceability: 0.55 },
};

// Uses real Spotify audio features (energy, valence, danceability) when available.
export function calculateMoodFromAudioFeatures(audioFeatures) {
  const valid = (audioFeatures || []).filter(Boolean);
  if (!valid.length) return null;
  const len = valid.length;
  return {
    energy:       valid.reduce((s, f) => s + (f.energy       ?? 0.6), 0) / len,
    happiness:    valid.reduce((s, f) => s + (f.valence      ?? 0.6), 0) / len,
    danceability: valid.reduce((s, f) => s + (f.danceability ?? 0.6), 0) / len,
  };
}

export function calculateMoodScores(artists) {
  if (!artists || artists.length === 0) {
    return { energy: 0.6, happiness: 0.6, danceability: 0.6 };
  }

  const allGenres = artists.flatMap((a) => a.genres || []);
  if (allGenres.length === 0) {
    return { energy: 0.6, happiness: 0.6, danceability: 0.6 };
  }

  const totals = { energy: 0, happiness: 0, danceability: 0 };
  let count = 0;

  for (const genre of allGenres) {
    const cat = categorizeGenre(genre);
    const weights = MOOD_WEIGHTS[cat] || MOOD_WEIGHTS.other;
    totals.energy += weights.energy;
    totals.happiness += weights.happiness;
    totals.danceability += weights.danceability;
    count++;
  }

  return {
    energy: totals.energy / count,
    happiness: totals.happiness / count,
    danceability: totals.danceability / count,
  };
}

export function getVibeLabel(scores) {
  const { energy, happiness, danceability } = scores;
  const avg = (energy + happiness + danceability) / 3;

  if (energy > 0.8 && danceability > 0.8) return 'Party Animal';
  if (energy > 0.75) return 'Energetic';
  if (happiness > 0.75 && danceability > 0.7) return 'Feel-Good';
  if (happiness > 0.7) return 'Upbeat';
  if (energy < 0.4 && happiness < 0.5) return 'Melancholic';
  if (energy < 0.45) return 'Chill';
  if (avg > 0.65) return 'Balanced';
  return 'Introspective';
}

// Diversity score: mix of artist obscurity (inverse popularity) + genre breadth.
export function calculateDiversityScore(artists) {
  if (!artists?.length) {
    return { score: 50, obscurityScore: 50, genreScore: 50, avgPopularity: 50, label: 'Unknown', rarities: [] };
  }

  const avgPopularity = artists.reduce((s, a) => s + (a.popularity ?? 50), 0) / artists.length;
  const obscurityScore = Math.round(100 - avgPopularity);

  const families = new Set(artists.flatMap((a) => (a.genres ?? []).map(categorizeGenre)));
  const genreScore = Math.min(100, Math.round((families.size / 10) * 100));

  const score = Math.round(obscurityScore * 0.65 + genreScore * 0.35);

  const label =
    score >= 75 ? 'Highly Eclectic' :
    score >= 55 ? 'Adventurous' :
    score >= 35 ? 'Balanced' :
    score >= 15 ? 'Mainstream' : 'Chart Devotee';

  const rarities = [...artists]
    .sort((a, b) => (a.popularity ?? 100) - (b.popularity ?? 100))
    .slice(0, 3);

  return { score, obscurityScore, genreScore, avgPopularity: Math.round(avgPopularity), label, rarities };
}

export function getVibeColor(label) {
  const map = {
    'Party Animal': '#f97316',
    'Energetic': '#ef4444',
    'Feel-Good': '#1db954',
    'Upbeat': '#3b82f6',
    'Melancholic': '#8b5cf6',
    'Chill': '#06b6d4',
    'Balanced': '#10b981',
    'Introspective': '#6b7280',
  };
  return map[label] || '#1db954';
}
