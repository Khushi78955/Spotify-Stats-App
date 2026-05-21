import styles from './TrackCard.module.css';

function formatDuration(ms) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function TrackCard({ track, rank, compact = false }) {
  const image = track.album?.images?.[0]?.url;
  const artists = track.artists?.map((a) => a.name).join(', ');

  if (compact) {
    return (
      <div className={styles.compact} style={{ animationDelay: `${rank * 50}ms` }}>
        <span className={styles.compactRank}>#{rank}</span>
        {image && <img src={image} alt={track.name} className={styles.compactImg} loading="lazy" />}
        <div className={styles.compactInfo}>
          <span className={styles.compactName}>{track.name}</span>
          <span className={styles.compactArtist}>{artists}</span>
        </div>
        <span className={styles.duration}>{formatDuration(track.duration_ms)}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.card} fade-in`} style={{ animationDelay: `${rank * 40}ms` }}>
      <div className={styles.rank}>#{rank}</div>
      {image ? (
        <img src={image} alt={track.name} className={styles.image} loading="lazy" />
      ) : (
        <div className={styles.imageFallback}>♪</div>
      )}
      <div className={styles.info}>
        <div className={styles.name}>{track.name}</div>
        <div className={styles.artist}>{artists}</div>
        <div className={styles.meta}>
          <span className={styles.album}>{track.album?.name}</span>
          <span className={styles.duration}>{formatDuration(track.duration_ms)}</span>
        </div>
      </div>
      <div className={styles.popularity}>
        <div className={styles.popularityBar}>
          <div
            className={styles.popularityFill}
            style={{ width: `${track.popularity || 0}%` }}
          />
        </div>
        <span className={styles.popularityLabel}>{track.popularity}</span>
      </div>
    </div>
  );
}
