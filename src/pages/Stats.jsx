import { useState, useEffect, lazy, Suspense } from 'react';
import { getUserProfile, getTopArtists, getTopTracks, getRecentlyPlayedBatch, getAudioFeatures } from '../api/spotify';
import { MOCK_USER, MOCK_TOP_ARTISTS, MOCK_RECENTLY_PLAYED } from '../api/mockData';
import { mergeRecentPlays, getAllPlays } from '../utils/historyDB';
import Navbar from '../components/Navbar';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { useTimeRange } from '../hooks/useTimeRange';
import styles from './Stats.module.css';

const ListeningHeatmap = lazy(() => import('../components/ListeningHeatmap'));
const MoodScore        = lazy(() => import('../components/MoodScore'));
const DiversityScore   = lazy(() => import('../components/DiversityScore'));
const TasteEvolution   = lazy(() => import('../components/TasteEvolution'));

export default function Stats() {
  useEffect(() => { document.title = 'Listening Stats · Statify'; }, []);
  const [timeRange, setTimeRange] = useTimeRange();
  const [user, setUser] = useState(null);
  const [artists, setArtists] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const sk = (h) => <SkeletonCard height={h} />;

  // Load user + recently played once (with IndexedDB merge)
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const [u, r] = await Promise.all([getUserProfile(), getRecentlyPlayedBatch(200)]);
        if (!mounted) return;
        setUser(u);
        await mergeRecentPlays(r?.items);
        const allPlays = await getAllPlays();
        const historicalItems = allPlays.map((p) => ({
          played_at: p.played_at,
          track: { id: p.track_id, name: p.track_name },
        }));
        if (mounted) {
          setRecent(historicalItems.length > (r?.items?.length || 0) ? { items: historicalItems } : r);
        }
      } catch {
        if (!mounted) return;
        setUser(MOCK_USER);
        setRecent(MOCK_RECENTLY_PLAYED);
        setDemoMode(true);
      } finally {
        if (mounted) setInitialized(true);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  // Reload artists + audio features on time range change
  useEffect(() => {
    if (!initialized) return;
    let mounted = true;
    async function loadRange() {
      if (demoMode) {
        setArtists(MOCK_TOP_ARTISTS);
        setAudioFeatures(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [a, t] = await Promise.all([getTopArtists(timeRange, 50), getTopTracks(timeRange, 50)]);
        if (!mounted) return;
        setArtists(a);
        try {
          const ids = t.items.slice(0, 100).map((x) => x.id);
          const af = await getAudioFeatures(ids);
          if (mounted) setAudioFeatures(af?.audio_features?.filter(Boolean) || null);
        } catch { if (mounted) setAudioFeatures(null); }
      } catch {
        if (!mounted) return;
        setArtists(MOCK_TOP_ARTISTS);
        setAudioFeatures(null);
        setDemoMode(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRange();
    return () => { mounted = false; };
  }, [timeRange, initialized, demoMode]);

  return (
    <>
      <Navbar user={user} />
      <div className="page" role="main" id="main-content">
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Listening Stats</h1>
              <p className={styles.sub}>Patterns, mood, and diversity in your listening</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          {demoMode && (
            <div className={styles.demoBanner}>
              <span className={styles.demoBadgeDot} />
              Showing demo data — connect Spotify for your real stats
            </div>
          )}

          {/* Heatmap — full width */}
          <ErrorBoundary label="Listening Patterns">
            <div className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>When You Listen</h2>
              <p className={styles.sectionSub}>Hour-of-day × day-of-week heatmap from accumulated history</p>
              {loading ? sk(240)
                : <Suspense fallback={sk(240)}><ListeningHeatmap recentlyPlayed={recent} /></Suspense>
              }
            </div>
          </ErrorBoundary>

          <div className={styles.twoCol}>
            <ErrorBoundary label="Mood Analysis">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Mood Analysis</h2>
                <p className={styles.sectionSub}>
                  {audioFeatures?.length ? 'From real track audio features' : 'Estimated from top genres'}
                </p>
                {loading ? sk(220)
                  : <Suspense fallback={sk(220)}><MoodScore artists={artists?.items || []} audioFeatures={audioFeatures} /></Suspense>
                }
              </div>
            </ErrorBoundary>

            <ErrorBoundary label="Listening Diversity">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Listening Diversity</h2>
                <p className={styles.sectionSub}>How eclectic and underground your taste is</p>
                {loading ? sk(220)
                  : <Suspense fallback={sk(220)}><DiversityScore artists={artists?.items || []} /></Suspense>
                }
              </div>
            </ErrorBoundary>
          </div>

          <ErrorBoundary label="Taste Evolution">
            <div className={`card ${styles.section}`}>
              <h2 className={styles.sectionTitle}>Taste Over Time</h2>
              <p className={styles.sectionSub}>How your top artists shifted across time windows</p>
              <Suspense fallback={sk(160)}><TasteEvolution /></Suspense>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
