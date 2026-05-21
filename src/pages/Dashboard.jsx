import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getUserProfile, getTopTracks, getTopArtists, getRecentlyPlayedBatch, getAudioFeatures } from '../api/spotify';
import { MOCK_USER, MOCK_TOP_TRACKS, MOCK_TOP_ARTISTS, MOCK_RECENTLY_PLAYED } from '../api/mockData';
import Navbar from '../components/Navbar';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import GenreCloud from '../components/GenreCloud';
import GenreChart from '../components/GenreChart';
import ListeningHeatmap from '../components/ListeningHeatmap';
import MoodScore from '../components/MoodScore';
import DiversityScore from '../components/DiversityScore';
import PersonalityCard from '../components/PersonalityCard';
import TasteEvolution from '../components/TasteEvolution';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { SkeletonCard } from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { useTimeRange } from '../hooks/useTimeRange';
import { useTilt } from '../hooks/useTilt';
import { useCountUp } from '../hooks/useCountUp';
import { getTopGenres } from '../utils/genreUtils';
import styles from './Dashboard.module.css';

gsap.registerPlugin(ScrollTrigger);

// Stat card with tilt + count-up + color glow on hover
function StatCard({ label, value, icon, color }) {
  const tiltRef = useTilt(6);
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0;
  const animated = useCountUp(numericValue);
  const display = typeof value === 'number' ? animated : value;

  return (
    <div
      ref={tiltRef}
      className={styles.statCard}
      style={{ '--glow-color': color }}
    >
      <span className={styles.statIcon} style={{ color }}>{icon}</span>
      <div className={styles.statValue}>{display}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  useEffect(() => { document.title = 'Dashboard · Statify'; }, []);
  const [timeRange, setTimeRange] = useTimeRange();
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);
  const [recent, setRecent] = useState(null);
  const [audioFeatures, setAudioFeatures] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const gridRef = useRef(null);

  // GSAP scroll animations on cards
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.card').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, gridRef);
    return () => ctx.revert();
  }, [loading]);

  // Init: user + recently played
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const [u, r] = await Promise.all([getUserProfile(), getRecentlyPlayedBatch(200)]);
        if (!mounted) return;
        setUser(u); setRecent(r);
      } catch {
        if (!mounted) return;
        setUser(MOCK_USER); setRecent(MOCK_RECENTLY_PLAYED); setDemoMode(true);
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
        setAudioFeatures(null); setLoading(false); return;
      }
      setLoading(true);
      try {
        const [t, a] = await Promise.all([getTopTracks(timeRange, 50), getTopArtists(timeRange, 50)]);
        if (!mounted) return;
        setTracks(t); setArtists(a);
        try {
          const ids = t.items.slice(0, 100).map((x) => x.id);
          const af = await getAudioFeatures(ids);
          if (mounted) setAudioFeatures(af?.audio_features?.filter(Boolean) || null);
        } catch { if (mounted) setAudioFeatures(null); }
      } catch {
        if (!mounted) return;
        setTracks(MOCK_TOP_TRACKS); setArtists(MOCK_TOP_ARTISTS);
        setAudioFeatures(null); setDemoMode(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRange();
    return () => { mounted = false; };
  }, [timeRange, initialized, demoMode]);

  const topGenres = artists ? getTopGenres(artists.items, 3) : [];
  const topGenreLabel = topGenres[0]?.genre || 'Various';

  return (
    <>
      <Navbar user={user} />
      <div className={`page ${styles.page}`}>
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
            <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          </div>

          {/* Stat cards */}
          {loading ? (
            <div className={styles.skeletonGrid}>
              {[1,2,3,4].map((i) => <SkeletonCard key={i} height={100} />)}
            </div>
          ) : (
            <div className={`${styles.statsRow} grid-4`}>
              <StatCard label="Top Genre"       value={topGenreLabel}               icon="🎭" color="var(--accent-purple)" />
              <StatCard label="Artists Tracked" value={artists?.items?.length || 0}  icon="🎤" color="var(--accent-green)" />
              <StatCard label="Tracks Tracked"  value={tracks?.items?.length || 0}   icon="🎵" color="var(--accent-blue)" />
              <StatCard label="Recent Plays"    value={recent?.items?.length || 0}   icon="🕐" color="var(--accent-orange)" />
            </div>
          )}

          {/* Bento grid */}
          <div className={styles.bentoGrid} ref={gridRef}>
            {/* Row 1: Tracks | Artists */}
            <ErrorBoundary label="Top Tracks">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Top Tracks</h2>
                  <a href="/tracks" className={styles.seeAll}>See all →</a>
                </div>
                {loading
                  ? [1,2,3,4,5].map((i) => <SkeletonCard key={i} height={52} />)
                  : tracks?.items?.slice(0,5).map((t,i) => <TrackCard key={t.id} track={t} rank={i+1} compact />)
                }
              </div>
            </ErrorBoundary>

            <ErrorBoundary label="Top Artists">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Top Artists</h2>
                  <a href="/artists" className={styles.seeAll}>See all →</a>
                </div>
                {loading
                  ? [1,2,3,4,5].map((i) => <SkeletonCard key={i} height={52} />)
                  : artists?.items?.slice(0,5).map((a,i) => <ArtistCard key={a.id} artist={a} rank={i+1} compact />)
                }
              </div>
            </ErrorBoundary>

            {/* Row 2: Genre chart — full width */}
            <ErrorBoundary label="Genre Breakdown">
              <div className={`card ${styles.section} ${styles.col2}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Genre Breakdown</h2>
                  <a href="/genres" className={styles.seeAll}>See all →</a>
                </div>
                {loading ? <SkeletonCard height={220} /> : <GenreChart artists={artists?.items || []} />}
              </div>
            </ErrorBoundary>

            {/* Row 3: Genre cloud | Taste Evolution */}
            <ErrorBoundary label="Genre Cloud">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <h2 className={styles.sectionTitle}>Genre Cloud</h2>
                {loading ? <SkeletonCard height={120} /> : <GenreCloud artists={artists?.items || []} />}
              </div>
            </ErrorBoundary>

            <ErrorBoundary label="Taste Evolution">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <h2 className={styles.sectionTitle}>Taste Over Time</h2>
                <p className={styles.sectionSub}>How your top artists shifted across time windows</p>
                <TasteEvolution />
              </div>
            </ErrorBoundary>

            {/* Row 4: Heatmap — full width */}
            <ErrorBoundary label="Listening Patterns">
              <div className={`card ${styles.section} ${styles.col2}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Listening Patterns</h2>
                  <a href="/stats" className={styles.seeAll}>See full →</a>
                </div>
                {loading ? <SkeletonCard height={180} /> : <ListeningHeatmap recentlyPlayed={recent} />}
              </div>
            </ErrorBoundary>

            {/* Row 5: Mood | Diversity */}
            <ErrorBoundary label="Mood Analysis">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Mood Analysis</h2>
                  <a href="/stats" className={styles.seeAll}>See full →</a>
                </div>
                {loading ? <SkeletonCard height={180} /> : <MoodScore artists={artists?.items || []} audioFeatures={audioFeatures} />}
              </div>
            </ErrorBoundary>

            <ErrorBoundary label="Listening Diversity">
              <div className={`card ${styles.section} ${styles.col1}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Listening Diversity</h2>
                  <a href="/stats" className={styles.seeAll}>See full →</a>
                </div>
                {loading ? <SkeletonCard height={180} /> : <DiversityScore artists={artists?.items || []} />}
              </div>
            </ErrorBoundary>

            {/* Row 6: Personality — full width */}
            <ErrorBoundary label="Music Personality">
              <div className={`card ${styles.section} ${styles.col2} ${styles.personality}`}>
                <h2 className={styles.sectionTitle}>Your Music Personality</h2>
                {loading
                  ? <SkeletonCard height={300} />
                  : <PersonalityCard user={user} topTracks={tracks?.items||[]} topArtists={artists?.items||[]} audioFeatures={audioFeatures} />
                }
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
