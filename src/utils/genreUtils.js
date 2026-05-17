const GENRE_FAMILIES = {
  electronic: ['electronic', 'edm', 'house', 'techno', 'dance', 'electro', 'synth', 'ambient', 'trance', 'drum and bass', 'dubstep'],
  hiphop: ['hip-hop', 'hip hop', 'rap', 'trap', 'grime', 'drill', 'boom bap', 'conscious hip hop'],
  rock: ['rock', 'metal', 'punk', 'grunge', 'alternative', 'indie rock', 'hard rock', 'classic rock'],
  pop: ['pop', 'dance pop', 'electropop', 'synth-pop', 'teen pop', 'k-pop', 'bedroom pop'],
  rnb: ['r&b', 'soul', 'funk', 'neo soul', 'contemporary r&b'],
  indie: ['indie', 'indie pop', 'indie folk', 'lo-fi', 'shoegaze'],
  classical: ['classical', 'orchestral', 'opera', 'chamber', 'baroque'],
  jazz: ['jazz', 'bebop', 'smooth jazz', 'fusion', 'swing'],
  country: ['country', 'country pop', 'bluegrass', 'americana', 'folk'],
  latin: ['latin', 'reggaeton', 'salsa', 'bachata', 'latin pop'],
};

export function categorizeGenre(genre) {
  const g = genre.toLowerCase();
  for (const [family, keywords] of Object.entries(GENRE_FAMILIES)) {
    if (keywords.some((k) => g.includes(k))) return family;
  }
  return 'other';
}

export function getGenreColor(category) {
  const colors = {
    electronic: '#3b82f6',
    hiphop: '#f59e0b',
    rock: '#ef4444',
    pop: '#1db954',
    rnb: '#8b5cf6',
    indie: '#06b6d4',
    classical: '#d97706',
    jazz: '#ec4899',
    country: '#84cc16',
    latin: '#f97316',
    other: '#6b7280',
  };
  return colors[category] || colors.other;
}

export function extractGenres(artists) {
  return artists.flatMap((a) => a.genres || []);
}

export function countGenres(genres) {
  return genres.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
}

export function getTopGenres(artists, n = 10) {
  const genres = extractGenres(artists);
  const counts = countGenres(genres);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([genre, count]) => ({
      genre,
      count,
      category: categorizeGenre(genre),
      color: getGenreColor(categorizeGenre(genre)),
    }));
}
