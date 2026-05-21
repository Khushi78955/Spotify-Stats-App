import { useState, useEffect } from 'react';
import { getTopArtists } from '../api/spotify';
import { MOCK_TOP_ARTISTS } from '../api/mockData';
import Navbar from '../components/Navbar';
import GenreChart from '../components/GenreChart';
import GenreCloud from '../components/GenreCloud';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { useTimeRange } from '../hooks/useTimeRange';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { getTopGenres, getGenreColor } from '../utils/genreUtils';
import styles from './Genres.module.css';

export default function Genres() {
  const user = useCurrentUser();
  const [timeRange, setTimeRange] = useTimeRange();

  useEffect(() => { document.title = 'Genres · Statify'; }, []);
  const [artists, setArtists] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const allGenres = artists ? getTopGenres(artists.items, 20) : [];
  const total = allGenres.reduce((s, g) => s + g.count, 0) || 1;

  return (
    <>
      <Navbar user={user} />
      <div className="page" role="main" id="main-content">
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Genre Breakdown</h1>
              <p className={styles.sub}>Your musical taste by genre family</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          <div className={styles.grid}>
            {/* Bar chart */}
            <ErrorBoundary label="Genre Chart">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Top Genres</h2>
                {loading
                  ? <SkeletonCard height={280} />
                  : <GenreChart artists={artists?.items || []} />
                }
              </div>
            </ErrorBoundary>

            {/* Word cloud */}
            <ErrorBoundary label="Genre Cloud">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Genre Cloud</h2>
                {loading
                  ? <SkeletonCard height={180} />
                  : <GenreCloud artists={artists?.items || []} />
                }
              </div>
            </ErrorBoundary>
          </div>

          {/* Full genre table */}
          <ErrorBoundary label="All Genres">
            <div className={`card ${styles.tableSection}`}>
              <h2 className={styles.sectionTitle}>All Genres</h2>
              {loading ? (
                <div className={styles.tableRows}>
                  {Array.from({ length: 10 }, (_, i) => <SkeletonCard key={i} height={40} />)}
                </div>
              ) : (
                <div className={styles.tableRows}>
                  {allGenres.map((g, i) => {
                    const pct = Math.round((g.count / total) * 100);
                    return (
                      <div key={g.genre} className={styles.row}>
                        <span className={styles.rank}>#{i + 1}</span>
                        <span className={styles.dot} style={{ background: getGenreColor(g.category) }} />
                        <span className={styles.genreName}>{g.genre}</span>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{ width: `${pct}%`, background: getGenreColor(g.category) }}
                          />
                        </div>
                        <span className={styles.pct}>{pct}%</span>
                        <span className={styles.count}>{g.count} artist{g.count !== 1 ? 's' : ''}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
