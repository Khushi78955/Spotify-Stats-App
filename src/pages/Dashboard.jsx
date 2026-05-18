import { useState, useEffect } from 'react';
import { getUserProfile, getTopTracks, getTopArtists, getRecentlyPlayedBatch } from '../api/spotify';
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
import { SkeletonCard } from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import { getTopGenres } from '../utils/genreUtils';
import styles from './Dashboard.module.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon} style={{ color }}>{icon}</span>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [u, t, a, r] = await Promise.all([
          getUserProfile(),
          getTopTracks('medium_term', 50),
          getTopArtists('medium_term', 50),
          getRecentlyPlayedBatch(200),
        ]);
        if (!mounted) return;
        setUser(u);
        setTracks(t);
        setArtists(a);
        setRecent(r);
      } catch (e) {
        if (!mounted) return;
        setUser(MOCK_USER);
        setTracks(MOCK_TOP_TRACKS);
        setArtists(MOCK_TOP_ARTISTS);
        setRecent(MOCK_RECENTLY_PLAYED);
        setError('Using demo data — connect Spotify for your real stats.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const topGenres = artists ? getTopGenres(artists.items, 3) : [];
  const topGenreLabel = topGenres[0]?.genre || '—';

  return (
    <>
      <Navbar user={user} />
      <div className={`page ${styles.page}`}>
        <div className="container">
          {error && (
            <div className={styles.demoBanner}>
              <span className={styles.demoBadge}>
                <span className={styles.demoBadgeDot} />
                DEMO MODE
              </span>
              <span className={styles.demoText}>
                Showing sample data — add your Spotify Client ID to see real stats
              </span>
            </div>
          )}

          <div className={styles.welcome}>
            <h1 className={styles.welcomeTitle}>
              Welcome back{user?.display_name ? `, ${user.display_name.split(' ')[0]}` : ''}
            </h1>
            <p className={styles.welcomeSub}>Here's your listening overview</p>
          </div>

          {loading ? (
            <div className={styles.skeletonGrid}>
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} height={100} />)}
            </div>
          ) : (
            <div className={`${styles.statsRow} grid-4`}>
              <StatCard label="Top Genre" value={topGenreLabel} icon="🎭" color="var(--accent-purple)" />
              <StatCard label="Artists Tracked" value={artists?.items?.length || 0} icon="🎤" color="var(--accent-green)" />
              <StatCard label="Tracks Tracked" value={tracks?.items?.length || 0} icon="🎵" color="var(--accent-blue)" />
              <StatCard label="Recent Plays" value={recent?.items?.length || 0} icon="🕐" color="var(--accent-orange)" />
            </div>
          )}

          <div className={styles.mainGrid}>
            {/* Top Tracks */}
            <ErrorBoundary label="Top Tracks">
              <div className={`card ${styles.section}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Top Tracks</h2>
                  <a href="/tracks" className={styles.seeAll}>See all →</a>
                </div>
                {loading
                  ? [1,2,3,4,5].map((i) => <SkeletonCard key={i} height={52} />)
                  : tracks?.items?.slice(0, 5).map((t, i) => (
                      <TrackCard key={t.id} track={t} rank={i + 1} compact />
                    ))
                }
              </div>
            </ErrorBoundary>

            {/* Top Artists */}
            <ErrorBoundary label="Top Artists">
              <div className={`card ${styles.section}`}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Top Artists</h2>
                  <a href="/artists" className={styles.seeAll}>See all →</a>
                </div>
                {loading
                  ? [1,2,3,4,5].map((i) => <SkeletonCard key={i} height={52} />)
                  : artists?.items?.slice(0, 5).map((a, i) => (
                      <ArtistCard key={a.id} artist={a} rank={i + 1} compact />
                    ))
                }
              </div>
            </ErrorBoundary>

            {/* Genre Chart */}
            <ErrorBoundary label="Genre Breakdown">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Genre Breakdown</h2>
                {loading
                  ? <SkeletonCard height={220} />
                  : <GenreChart artists={artists?.items || []} />
                }
              </div>
            </ErrorBoundary>

            {/* Genre Cloud */}
            <ErrorBoundary label="Genre Cloud">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Genre Cloud</h2>
                {loading
                  ? <SkeletonCard height={120} />
                  : <GenreCloud artists={artists?.items || []} />
                }
              </div>
            </ErrorBoundary>

            {/* Heatmap */}
            <ErrorBoundary label="Listening Patterns">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Listening Patterns</h2>
                {loading
                  ? <SkeletonCard height={180} />
                  : <ListeningHeatmap recentlyPlayed={recent} />
                }
              </div>
            </ErrorBoundary>

            {/* Mood */}
            <ErrorBoundary label="Mood Analysis">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Mood Analysis</h2>
                {loading
                  ? <SkeletonCard height={180} />
                  : <MoodScore artists={artists?.items || []} />
                }
              </div>
            </ErrorBoundary>

            {/* Diversity Score */}
            <ErrorBoundary label="Listening Diversity">
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Listening Diversity</h2>
                {loading
                  ? <SkeletonCard height={180} />
                  : <DiversityScore artists={artists?.items || []} />
                }
              </div>
            </ErrorBoundary>

            {/* Personality Card */}
            <ErrorBoundary label="Music Personality">
              <div className={`card ${styles.section} ${styles.personality}`}>
                <h2 className={styles.sectionTitle}>Your Music Personality</h2>
                {loading
                  ? <SkeletonCard height={300} />
                  : (
                    <PersonalityCard
                      user={user}
                      topTracks={tracks?.items || []}
                      topArtists={artists?.items || []}
                    />
                  )
                }
              </div>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
