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
  other:      { energy: 0.55, happiness: 0.55, danceability: 0.55 },
};

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
