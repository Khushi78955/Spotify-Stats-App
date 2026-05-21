import { useState, useEffect, useMemo } from 'react';
import { getTopArtists } from '../api/spotify';
import { MOCK_TOP_ARTISTS } from '../api/mockData';
import styles from './TasteEvolution.module.css';

const WINDOWS = [
  { key: 'short_term',  label: '4 Weeks',  color: '#1db954' },
  { key: 'medium_term', label: '6 Months', color: '#3b82f6' },
  { key: 'long_term',   label: 'All Time', color: '#8b5cf6' },
];

// Module-level cache — shared across Dashboard + Stats, fetched only once per session
let cachedData = null;

function useThreeWindows() {
  const [data, setData] = useState(cachedData);
  const [loading, setLoading] = useState(!cachedData);

  useEffect(() => {
    if (cachedData) return;
    let mounted = true;
    async function load() {
      try {
        const [s, m, l] = await Promise.all(
          WINDOWS.map((w) => getTopArtists(w.key, 20))
        );
        cachedData = { short: s.items, medium: m.items, long: l.items };
        if (mounted) setData(cachedData);
      } catch {
        const mock = MOCK_TOP_ARTISTS.items;
        cachedData = { short: mock, medium: mock, long: mock };
        if (mounted) setData(cachedData);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return { data, loading };
}

function overlap(a, b) {
  const setA = new Set(a.map((x) => x.id));
  return b.filter((x) => setA.has(x.id)).length;
}

export default function TasteEvolution() {
  const { data, loading } = useThreeWindows();

  const stats = useMemo(() => {
    if (!data) return null;
    const { short, medium, long } = data;
    const shortMedium = overlap(short, medium);
    const mediumLong  = overlap(medium, long);
    const shortLong   = overlap(short, long);
    const rising  = short.filter((a) => !medium.some((b) => b.id === a.id)).slice(0, 3);
    const fading  = medium.filter((a) => !short.some((b) => b.id === a.id)).slice(0, 3);
    const allTime = long.filter((a) => medium.some((b) => b.id === a.id) && short.some((b) => b.id === a.id)).slice(0, 3);
    return { shortMedium, mediumLong, shortLong, rising, fading, allTime };
  }, [data]);

  if (loading) {
    return (
      <div className={styles.loading}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`skeleton ${styles.skeletonBar}`} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={styles.wrapper}>
      {/* Overlap bars */}
      <div className={styles.overlapSection}>
        <div className={styles.overlapRow}>
          <span className={styles.overlapLabel}>
            <span className={styles.dot} style={{ background: WINDOWS[0].color }} />
            4W ↔ 6M overlap
          </span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${(stats.shortMedium / 20) * 100}%`, background: WINDOWS[0].color }}
            />
          </div>
          <span className={styles.overlapCount}>{stats.shortMedium}/20</span>
        </div>
        <div className={styles.overlapRow}>
          <span className={styles.overlapLabel}>
            <span className={styles.dot} style={{ background: WINDOWS[1].color }} />
            6M ↔ All-Time
          </span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${(stats.mediumLong / 20) * 100}%`, background: WINDOWS[1].color }}
            />
          </div>
          <span className={styles.overlapCount}>{stats.mediumLong}/20</span>
        </div>
        <div className={styles.overlapRow}>
          <span className={styles.overlapLabel}>
            <span className={styles.dot} style={{ background: WINDOWS[2].color }} />
            4W ↔ All-Time
          </span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${(stats.shortLong / 20) * 100}%`, background: WINDOWS[2].color }}
            />
          </div>
          <span className={styles.overlapCount}>{stats.shortLong}/20</span>
        </div>
      </div>

      {/* Artist buckets */}
      <div className={styles.buckets}>
        <div className={styles.bucket}>
          <div className={styles.bucketHeader}>
            <span className={styles.bucketIcon}>🚀</span>
            <span className={styles.bucketLabel}>Rising</span>
            <span className={styles.bucketSub}>new in 4W</span>
          </div>
          {stats.rising.map((a) => <ArtistChip key={a.id} artist={a} color={WINDOWS[0].color} />)}
          {stats.rising.length === 0 && <span className={styles.empty}>Stable taste</span>}
        </div>

        <div className={styles.bucket}>
          <div className={styles.bucketHeader}>
            <span className={styles.bucketIcon}>🏛️</span>
            <span className={styles.bucketLabel}>All-Time</span>
            <span className={styles.bucketSub}>across all windows</span>
          </div>
          {stats.allTime.map((a) => <ArtistChip key={a.id} artist={a} color={WINDOWS[2].color} />)}
          {stats.allTime.length === 0 && <span className={styles.empty}>—</span>}
        </div>

        <div className={styles.bucket}>
          <div className={styles.bucketHeader}>
            <span className={styles.bucketIcon}>📉</span>
            <span className={styles.bucketLabel}>Fading</span>
            <span className={styles.bucketSub}>dropped from 4W</span>
          </div>
          {stats.fading.map((a) => <ArtistChip key={a.id} artist={a} color="#6b7280" />)}
          {stats.fading.length === 0 && <span className={styles.empty}>No drop-offs</span>}
        </div>
      </div>
    </div>
  );
}

function ArtistChip({ artist, color }) {
  return (
    <div className={styles.chip}>
      {artist.images?.[0]?.url
        ? <img src={artist.images[0].url} alt={artist.name} className={styles.chipImg} />
        : <div className={styles.chipFallback} style={{ background: color }}>{artist.name[0]}</div>
      }
      <span className={styles.chipName}>{artist.name}</span>
    </div>
  );
}
