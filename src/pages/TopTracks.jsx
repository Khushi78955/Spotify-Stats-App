import { useState, useEffect } from 'react';
import { getTopTracks } from '../api/spotify';
import { MOCK_TOP_TRACKS } from '../api/mockData';
import Navbar from '../components/Navbar';
import TrackCard from '../components/TrackCard';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useTimeRange } from '../hooks/useTimeRange';
import { useCurrentUser } from '../hooks/useCurrentUser';
import styles from './TopItems.module.css';

export default function TopTracks() {
  const user = useCurrentUser();
  const [timeRange, setTimeRange] = useTimeRange();
  const [tracks, setTracks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => { document.title = 'Top Tracks · Statify'; }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getTopTracks(timeRange, 50);
        if (mounted) setTracks(data);
      } catch {
        if (mounted) setTracks(MOCK_TOP_TRACKS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [timeRange]);

  const filtered = tracks?.items?.filter((t) =>
    !query ||
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.artists?.some((a) => a.name.toLowerCase().includes(query.toLowerCase()))
  ) ?? [];

  return (
    <>
      <Navbar user={user} />
      <div className="page" role="main" id="main-content">
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Top Tracks</h1>
              <p className={styles.sub}>Your most played songs on Spotify</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          <input
            className={styles.search}
            type="search"
            placeholder="Search tracks or artists…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tracks"
          />
          {query && (
            <p className={styles.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{query}"
            </p>
          )}

          <div className={styles.list}>
            {loading
              ? Array.from({ length: 10 }, (_, i) => <SkeletonCard key={i} height={88} />)
              : filtered.length === 0
                ? <EmptyState type={query ? 'search' : 'tracks'} />
                : filtered.map((t, i) => <TrackCard key={t.id} track={t} rank={i + 1} />)
            }
          </div>
        </div>
      </div>
    </>
  );
}
