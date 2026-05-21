import { useMemo } from 'react';
import { getTopGenres } from '../utils/genreUtils';
import styles from './GenreCloud.module.css';

const ENTRANCE_DIRS = [
  'translateX(-60px)', 'translateX(60px)',
  'translateY(60px)',  'translateY(-60px)',
  'translate(-40px,-40px)', 'translate(40px,-40px)',
  'translate(-40px,40px)',  'translate(40px,40px)',
];

// Fixed rotations computed once at module load — stable across renders
const ROTATIONS = Array.from({ length: 20 }, (_, i) => ((i * 137.5) % 12) - 6);

export default function GenreCloud({ artists }) {
  const genres = useMemo(() => getTopGenres(artists, 15), [artists]);

  // Precompute stable random values once per render (not on every hover)
  const meta = useMemo(() =>
    genres.map((_, i) => ({
      rotation: ROTATIONS[i % ROTATIONS.length],
      entrance: ENTRANCE_DIRS[i % ENTRANCE_DIRS.length],
      delay: i * 55,
    })),
  [genres]);

  if (!genres.length) return <div className={styles.empty}>No genre data available</div>;

  const maxCount = genres[0]?.count || 1;

  return (
    <div className={styles.cloud}>
      {genres.map((g, i) => {
        const opacity = 0.5 + (g.count / maxCount) * 0.5;
        const { rotation, entrance, delay } = meta[i] || {};
        return (
          <div
            key={g.genre}
            className={styles.tag}
            style={{
              fontSize: `${12 + (g.count / maxCount) * 14}px`,
              color: g.color,
              background: `${g.color}18`,
              border: `1px solid ${g.color}40`,
              opacity,
              '--rot': `${rotation}deg`,
              '--entrance': entrance,
              animationDelay: `${delay}ms`,
            }}
            title={`${g.genre}: ${g.count} artists`}
          >
            {g.genre}
            <span className={styles.count}>{g.count}</span>
          </div>
        );
      })}
    </div>
  );
}
