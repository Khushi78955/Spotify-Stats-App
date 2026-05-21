import styles from './EmptyState.module.css';

const MESSAGES = {
  tracks:  { icon: '🎵', title: 'No tracks yet',          sub: 'Start listening on Spotify and come back!' },
  artists: { icon: '🎤', title: 'No artists yet',         sub: 'Listen to some music to see your top artists.' },
  genres:  { icon: '🎭', title: 'No genres yet',          sub: 'Your genre breakdown will appear after some listening.' },
  heatmap: { icon: '🗓️', title: 'No listening history',   sub: 'Play some music on Spotify to populate your heatmap.' },
  search:  { icon: '🔍', title: 'No results',             sub: 'Try a different search term.' },
  default: { icon: '🎶', title: 'Nothing here yet',       sub: 'Keep listening and check back soon.' },
};

export default function EmptyState({ type = 'default' }) {
  const { icon, title, sub } = MESSAGES[type] || MESSAGES.default;
  return (
    <div className={styles.wrapper} role="status" aria-label={title}>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.title}>{title}</p>
      <p className={styles.sub}>{sub}</p>
    </div>
  );
}
