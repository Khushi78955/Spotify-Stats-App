import { useState, useEffect, lazy, Suspense } from 'react';
import { getTopArtists } from '../api/spotify';
import { MOCK_TOP_ARTISTS } from '../api/mockData';
import Navbar from '../components/Navbar';
import ArtistCard from '../components/ArtistCard';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useTimeRange } from '../hooks/useTimeRange';
import { useCurrentUser } from '../hooks/useCurrentUser';
import styles from './TopItems.module.css';

const ArtistModal = lazy(() => import('../components/ArtistModal'));

export default function TopArtists() {
  const user = useCurrentUser();
  const [timeRange, setTimeRange] = useTimeRange();
  const [artists, setArtists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => { document.title = 'Top Artists · Statify'; }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getTopArtists(timeRange, 50);
        if (mounted) setArtists(data);
      } catch {
        if (mounted) setArtists(MOCK_TOP_ARTISTS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [timeRange]);

  const filtered = artists?.items?.filter((a) =>
    !query ||
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.genres?.some((g) => g.toLowerCase().includes(query.toLowerCase()))
  ) ?? [];

  return (
    <>
      <Navbar user={user} />
      <div className="page" role="main" id="main-content">
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Top Artists</h1>
              <p className={styles.sub}>Your most listened-to artists on Spotify</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          <input
            className={styles.search}
            type="search"
            placeholder="Search artists or genres…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter artists"
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
                ? <EmptyState type={query ? 'search' : 'artists'} />
                : filtered.map((a, i) => (
                    <div key={a.id} onClick={() => setSelectedArtist(a)} style={{ cursor: 'pointer' }}>
                      <ArtistCard artist={a} rank={i + 1} />
                    </div>
                  ))
            }
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
      </Suspense>
    </>
  );
}
