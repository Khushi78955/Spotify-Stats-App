import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getUserProfile, getTopTracks, getTopArtists, getRecentlyPlayedBatch, getAudioFeatures } from '../api/spotify';
import { MOCK_USER, MOCK_TOP_TRACKS, MOCK_TOP_ARTISTS, MOCK_RECENTLY_PLAYED } from '../api/mockData';
import { mergeRecentPlays, getAllPlays, getPlayCount } from '../utils/historyDB';
import Navbar from '../components/Navbar';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import GenreCloud from '../components/GenreCloud';
import GenreChart from '../components/GenreChart';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import EmptyState from '../components/EmptyState';
import { useTimeRange } from '../hooks/useTimeRange';
import { useTilt } from '../hooks/useTilt';
import { useCountUp } from '../hooks/useCountUp';
import { getTopGenres } from '../utils/genreUtils';
import styles from './Dashboard.module.css';

const ListeningHeatmap = lazy(() => import('../components/ListeningHeatmap'));
const MoodScore        = lazy(() => import('../components/MoodScore'));
const DiversityScore   = lazy(() => import('../components/DiversityScore'));
const PersonalityCard  = lazy(() => import('../components/PersonalityCard'));
const TasteEvolution   = lazy(() => import('../components/TasteEvolution'));
const ArtistModal      = lazy(() => import('../components/ArtistModal'));

gsap.registerPlugin(ScrollTrigger);

function StatCard({ label, value, icon, color }) {
  const tiltRef = useTilt(6);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
  const animated = useCountUp(numericValue);
  const display = typeof value === 'number' ? animated : value;

  return (
    <div ref={tiltRef} className={styles.statCard} style={{ '--glow-color': color }}>
      <span className={styles.statIcon} style={{ color }}>{icon}</span>
      <div className={styles.statValue}>{display}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  useEffect(() => { document.title = 'Dashboard · Statify'; }, []);
  const [timeRange, setTimeRange] = useTimeRange();
  const [debouncedRange, setDebouncedRange] = useState(timeRange);
  const debounceRef = useRef(null);
  const handleRangeChange = (val) => {
    setTimeRange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedRange(val), 300);
  };

  const [user, setUser]               = useState(null);
  const [tracks, setTracks]           = useState(null);
  const [artists, setArtists]         = useState(null);
  const [recent, setRecent]           = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [totalPlays, setTotalPlays]   = useState(0);
  const [loading, setLoading]         = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [demoMode, setDemoMode]       = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const gridRef = useRef(null);

  // GSAP scroll animations
  useEffect(() => {
    if (loading) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.card').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading]);

  // Init: user + recently played + IndexedDB
  useEffect(() => {
    let mounted = true;
    async function init() {
      setLoadProgress(20);
      try {
        const [u, r] = await Promise.all([getUserProfile(), getRecentlyPlayedBatch(200)]);
        if (!mounted) return;
        setLoadProgress(50);
        setUser(u);

        // Merge into IndexedDB and load full history
        await mergeRecentPlays(r?.items);
        const allPlays = await getAllPlays();
        const count = await getPlayCount();
        const historicalItems = allPlays.map((p) => ({
          played_at: p.played_at,
          track: { id: p.track_id, name: p.track_name },
        }));
        if (mounted) {
          setRecent(historicalItems.length > (r?.items?.length || 0) ? { items: historicalItems } : r);
          setTotalPlays(count || r?.items?.length || 0);
          setLoadProgress(80);
        }
      } catch {
        if (!mounted) return;
        setUser(MOCK_USER);
        setRecent(MOCK_RECENTLY_PLAYED);
        setTotalPlays(MOCK_RECENTLY_PLAYED.items.length);
        setDemoMode(true);
        setLoadProgress(100);
      } finally {
        if (mounted) setInitialized(true);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  // Time-range: tracks + artists + audio features
  useEffect(() => {
    if (!initialized) return;
    let mounted = true;
    async function loadRange() {
      if (demoMode) {
        setTracks(MOCK_TOP_TRACKS); setArtists(MOCK_TOP_ARTISTS);
        setAudioFeatures(null); setLoading(false); setLoadProgress(100); return;
      }
      setLoading(true);
      setLoadProgress(10);
      try {
        const [t, a] = await Promise.all([getTopTracks(debouncedRange, 50), getTopArtists(debouncedRange, 50)]);
        if (!mounted) return;
        setTracks(t); setArtists(a);
        setLoadProgress(70);
        try {
          const ids = t.items.slice(0, 100).map((x) => x.id);
          const af = await getAudioFeatures(ids);
          if (mounted) setAudioFeatures(af?.audio_features?.filter(Boolean) || null);
        } catch { if (mounted) setAudioFeatures(null); }
        setLoadProgress(100);
      } catch {
        if (!mounted) return;
        setTracks(MOCK_TOP_TRACKS); setArtists(MOCK_TOP_ARTISTS);
        setAudioFeatures(null); setDemoMode(true); setLoadProgress(100);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRange();
    return () => { mounted = false; };
  }, [debouncedRange, initialized, demoMode]);

  const topGenres = artists ? getTopGenres(artists.items, 3) : [];
  const topGenreLabel = topGenres[0]?.genre || 'Various';

  const skeleton = (h) => <SkeletonCard height={h} />;

  return (
    <>
      <Navbar user={user} />

      {/* Load progress bar */}
      {loadProgress < 100 && (
        <div style={{ position: 'fixed', top: 60, left: 0, right: 0, height: 2, zIndex: 99, background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ height: '100%', width: `${loadProgress}%`, background: 'linear-gradient(90deg,#1db954,#8b5cf6)', transition: 'width 0.4s ease', borderRadius: '0 2px 2px 0' }} />
        </div>
      )}

      <div className={`page ${styles.page}`} role="main" id="main-content">
        <div className="container">
          {demoMode && (
            <div className={styles.demoBanner}>
              <span className={styles.demoBadge}><span className={styles.demoBadgeDot} />DEMO</span>
              <span className={styles.demoText}>Sample data — add your Spotify Client ID for real stats</span>
            </div>
          )}

          <div className={styles.welcomeRow}>
            <div className={styles.welcome}>
              <h1 className={styles.welcomeTitle}>
                Welcome back{user?.display_name ? `, ${user.display_name.split(' ')[0]}` : ''}
              </h1>
              <p className={styles.welcomeSub}>Here's your listening overview</p>
            </div>
            <TimeRangeSelector value={timeRange} onChange={handleRangeChange} />
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>{[1,2,3,4].map((i) => <SkeletonCard key={i} height={100} />)}</div>
          ) : (
            <div className={`${styles.statsRow} grid-4`}>
              <StatCard key={`genre-${debouncedRange}`}   label="Top Genre"       value={topGenreLabel}              icon="🎭" color="var(--accent-purple)" />
              <StatCard key={`artists-${debouncedRange}`} label="Artists Tracked" value={artists?.items?.length||0}  icon="🎤" color="var(--accent-green)" />
              <StatCard key={`tracks-${debouncedRange}`}  label="Tracks Tracked"  value={tracks?.items?.length||0}   icon="🎵" color="var(--accent-blue)" />
              <StatCard key={`plays-${debouncedRange}`}   label="Total Tracked"   value={totalPlays}                 icon="🕐" color="var(--accent-orange)" />
            </div>
          )}

          <div className={styles.bentoGrid} ref={gridRef}>
            {/* Tracks */}
            <ErrorBoundary label="Top Tracks">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Top Tracks</h2>
                  <a href="/tracks" className={styles.seeAll}>See all →</a>
                </div>
                {loading ? [1,2,3,4,5].map((i) => <SkeletonCard key={i} height={52} />)
                  : tracks?.items?.length === 0 ? <EmptyState type="tracks" />
                  : tracks?.items?.slice(0,5).map((t,i) => <TrackCard key={t.id} track={t} rank={i+1} compact />)
                }
              </div>
            </ErrorBoundary>

            {/* Artists — clickable for modal */}
            <ErrorBoundary label="Top Artists">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Top Artists</h2>
                  <a href="/artists" className={styles.seeAll}>See all →</a>
                </div>
                {loading ? [1,2,3,4,5].map((i) => <SkeletonCard key={i} height={52} />)
                  : artists?.items?.length === 0 ? <EmptyState type="artists" />
                  : artists?.items?.slice(0,5).map((a,i) => (
                      <div key={a.id} onClick={() => setSelectedArtist(a)} style={{ cursor: 'pointer' }}>
                        <ArtistCard artist={a} rank={i+1} compact />
                      </div>
                    ))
                }
              </div>
            </ErrorBoundary>

            {/* Genre chart — full width */}
            <ErrorBoundary label="Genre Breakdown">
              <div className={`card ${styles.section} ${styles.col2}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Genre Breakdown</h2>
                  <a href="/genres" className={styles.seeAll}>See all →</a>
                </div>
                {loading ? skeleton(220) : <GenreChart artists={artists?.items || []} />}
              </div>
            </ErrorBoundary>

            {/* Genre cloud | Taste Evolution */}
            <ErrorBoundary label="Genre Cloud">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <h2 className={styles.sectionTitle}>Genre Cloud</h2>
                {loading ? skeleton(120) : <GenreCloud artists={artists?.items || []} />}
              </div>
            </ErrorBoundary>

            <ErrorBoundary label="Taste Evolution">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <h2 className={styles.sectionTitle}>Taste Over Time</h2>
                <p className={styles.sectionSub}>How your top artists shifted</p>
                <Suspense fallback={skeleton(160)}>
                  <TasteEvolution />
                </Suspense>
              </div>
            </ErrorBoundary>

            {/* Heatmap — full width */}
            <ErrorBoundary label="Listening Patterns">
              <div className={`card ${styles.section} ${styles.col2}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Listening Patterns</h2>
                  <a href="/stats" className={styles.seeAll}>See full →</a>
                </div>
                {loading ? skeleton(180)
                  : recent?.items?.length === 0 ? <EmptyState type="heatmap" />
                  : <Suspense fallback={skeleton(180)}><ListeningHeatmap recentlyPlayed={recent} /></Suspense>
                }
              </div>
            </ErrorBoundary>

            {/* Mood | Diversity */}
            <ErrorBoundary label="Mood Analysis">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Mood Analysis</h2>
                  <a href="/stats" className={styles.seeAll}>See full →</a>
                </div>
                {loading ? skeleton(180)
                  : <Suspense fallback={skeleton(180)}><MoodScore artists={artists?.items||[]} audioFeatures={audioFeatures} /></Suspense>
                }
              </div>
            </ErrorBoundary>

            <ErrorBoundary label="Listening Diversity">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Listening Diversity</h2>
                  <a href="/stats" className={styles.seeAll}>See full →</a>
                </div>
                {loading ? skeleton(180)
                  : <Suspense fallback={skeleton(180)}><DiversityScore artists={artists?.items||[]} /></Suspense>
                }
              </div>
            </ErrorBoundary>

            {/* Personality — full width */}
            <ErrorBoundary label="Music Personality">
              <div className={`card ${styles.section} ${styles.col2} ${styles.personality}`}>
                <h2 className={styles.sectionTitle}>Your Music Personality</h2>
                {loading ? skeleton(300)
                  : <Suspense fallback={skeleton(300)}>
                      <PersonalityCard user={user} topTracks={tracks?.items||[]} topArtists={artists?.items||[]} audioFeatures={audioFeatures} />
                    </Suspense>
                }
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Artist modal */}
      <Suspense fallback={null}>
        <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
      </Suspense>
    </>
  );
}
