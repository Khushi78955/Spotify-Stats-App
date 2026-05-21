import { useState, useEffect } from 'react';
import { getTopTracks } from '../api/spotify';
import { MOCK_TOP_TRACKS } from '../api/mockData';
import Navbar from '../components/Navbar';
import TrackCard from '../components/TrackCard';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import { useTimeRange } from '../hooks/useTimeRange';
import styles from './TopItems.module.css';

export default function TopTracks() {
  const [timeRange, setTimeRange] = useTimeRange();
  const [tracks, setTracks] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Top Tracks</h1>
              <p className={styles.sub}>Your most played songs on Spotify</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          <div className={styles.list}>
            {loading
              ? Array.from({ length: 10 }, (_, i) => <SkeletonCard key={i} height={88} />)
              : tracks?.items?.map((t, i) => (
                  <TrackCard key={t.id} track={t} rank={i + 1} />
                ))
            }
          </div>
        </div>
      </div>
    </>
  );
}
