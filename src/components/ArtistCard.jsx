import styles from './ArtistCard.module.css';

function formatFollowers(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n?.toString() || '0';
}

export default function ArtistCard({ artist, rank, compact = false }) {
  const image = artist.images?.[0]?.url;
  const topGenre = artist.genres?.[0];

  if (compact) {
    return (
      <div className={styles.compact} style={{ animationDelay: `${rank * 50}ms` }}>
        <span className={styles.compactRank}>#{rank}</span>
        {image ? (
          <img src={image} alt={artist.name} className={styles.compactImg} />
        ) : (
          <div className={styles.compactImgFallback}>{artist.name[0]}</div>
        )}
        <div className={styles.compactInfo}>
          <span className={styles.compactName}>{artist.name}</span>
          {topGenre && <span className={styles.compactGenre}>{topGenre}</span>}
        </div>
        <span className={styles.followers}>{formatFollowers(artist.followers?.total)}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.card} fade-in`} style={{ animationDelay: `${rank * 40}ms` }}>
      <div className={styles.rank}>#{rank}</div>
      {image ? (
        <img src={image} alt={artist.name} className={styles.image} />
      ) : (
        <div className={styles.imageFallback}>{artist.name[0]}</div>
      )}
      <div className={styles.info}>
        <div className={styles.name}>{artist.name}</div>
        <div className={styles.genres}>
          {artist.genres?.slice(0, 2).map((g) => (
            <span key={g} className={styles.genre}>{g}</span>
          ))}
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            {formatFollowers(artist.followers?.total)} followers
          </span>
          <span className={styles.metaItem}>
            {artist.popularity} popularity
          </span>
        </div>
      </div>
    </div>
  );
}
