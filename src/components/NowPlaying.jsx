import { useState, useEffect, useRef } from 'react';
import { getCurrentlyPlaying } from '../api/spotify';
import styles from './NowPlaying.module.css';

export default function NowPlaying() {
  const [track, setTrack] = useState(null);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function poll() {
      const data = await getCurrentlyPlaying();
      if (!mounted) return;
      if (data?.is_playing && data?.item) {
        setTrack(data.item);
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    poll();
    intervalRef.current = setInterval(poll, 30000);
    return () => { mounted = false; clearInterval(intervalRef.current); };
  }, []);

  if (!visible || !track) return null;

  const image    = track.album?.images?.[0]?.url;
  const artists  = track.artists?.map((a) => a.name).join(', ');
  const progress = track.duration_ms
    ? Math.round((track.progress_ms / track.duration_ms) * 100)
    : 0;

  return (
    <div className={styles.bar} role="status" aria-label={`Now playing: ${track.name} by ${artists}`}>
      <div className={styles.pulse} aria-hidden="true" />
      {image && <img src={image} alt={track.name} className={styles.img} loading="lazy" />}
      <div className={styles.info}>
        <span className={styles.name}>{track.name}</span>
        <span className={styles.artist}>{artists}</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <span className={styles.label} aria-hidden="true">NOW PLAYING</span>
    </div>
  );
}
