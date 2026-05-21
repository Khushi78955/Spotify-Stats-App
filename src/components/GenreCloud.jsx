import { useMemo } from 'react';
import { getTopGenres } from '../utils/genreUtils';
import styles from './GenreCloud.module.css';

export default function GenreCloud({ artists }) {
  const genres = useMemo(() => getTopGenres(artists, 15), [artists]);

  if (!genres.length) {
    return <div className={styles.empty}>No genre data available</div>;
  }

  const maxCount = genres[0]?.count || 1;

  return (
    <div className={styles.cloud}>
      {genres.map((g, i) => {
        const opacity = 0.5 + (g.count / maxCount) * 0.5;
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
              animationDelay: `${i * 60}ms`,
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
