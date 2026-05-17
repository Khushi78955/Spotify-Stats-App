import { useState, useEffect } from 'react';
import { getTopArtists } from '../api/spotify';
import { MOCK_TOP_ARTISTS } from '../api/mockData';
import Navbar from '../components/Navbar';
import ArtistCard from '../components/ArtistCard';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import styles from './TopItems.module.css';

export default function TopArtists() {
  const [timeRange, setTimeRange] = useState('medium_term');
  const [artists, setArtists] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTopArtists(timeRange, 50)
      .then((data) => { if (mounted) setArtists(data); })
      .catch(() => { if (mounted) setArtists(MOCK_TOP_ARTISTS); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [timeRange]);

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Top Artists</h1>
              <p className={styles.sub}>Your most listened-to artists on Spotify</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          <div className={styles.list}>
            {loading
              ? Array.from({ length: 10 }, (_, i) => <SkeletonCard key={i} height={88} />)
              : artists?.items?.map((a, i) => (
                  <ArtistCard key={a.id} artist={a} rank={i + 1} />
                ))
            }
          </div>
        </div>
      </div>
    </>
  );
}
