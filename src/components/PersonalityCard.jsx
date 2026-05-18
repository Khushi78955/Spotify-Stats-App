import { useRef, useMemo, Fragment } from 'react';
import { downloadPersonalityCard } from '../utils/exportUtils';
import { getTopGenres } from '../utils/genreUtils';
import { calculateMoodScores, getVibeLabel, calculateDiversityScore } from '../utils/moodUtils';
import styles from './PersonalityCard.module.css';

const PERSONALITIES = {
  mainstream: { name: 'The Trendsetter',        emoji: '🔥' },
  eclectic:   { name: 'The Eclectic Explorer',   emoji: '🗺️' },
  electronic: { name: 'The Night Owl',           emoji: '🦉' },
  hiphop:     { name: 'The Rhythm Rider',        emoji: '🎤' },
  rock:       { name: 'The Headbanger',          emoji: '🤘' },
  indie:      { name: 'The Hidden Gem Hunter',   emoji: '💎' },
  classical:  { name: 'The Sophisticated Soul',  emoji: '🎼' },
  rnb:        { name: 'The Smooth Operator',     emoji: '🎶' },
  chill:      { name: 'The Zen Master',          emoji: '🧘' },
  pop:        { name: 'The Chart Surfer',        emoji: '📈' },
  latin:      { name: 'The Rhythm Ambassador',   emoji: '💃' },
  jazz:       { name: 'The Late Night Thinker',  emoji: '🌙' },
};

function getPersonality(artists) {
  if (!artists?.length) return PERSONALITIES.eclectic;
  const genres = getTopGenres(artists, 5);
  if (!genres.length) return PERSONALITIES.eclectic;
  return PERSONALITIES[genres[0].category] || PERSONALITIES.eclectic;
}

function estimatedMinutes(tracks) {
  if (!tracks?.length) return 0;
  const avgMs = tracks.reduce((s, t) => s + (t.duration_ms || 210000), 0) / tracks.length;
  // Rough estimate: if these are "top 50" assume they're each played ~20x over 6 months
  return Math.round((avgMs * tracks.length * 20) / 60000);
}

function formatMinutes(mins) {
  if (mins >= 1440) return `${Math.round(mins / 1440)}d`;
  if (mins >= 60)   return `${Math.round(mins / 60)}h`;
  return `${mins}m`;
}

export default function PersonalityCard({ user, topTracks, topArtists }) {
  const cardRef = useRef(null);

  const personality   = useMemo(() => getPersonality(topArtists), [topArtists]);
  const topGenres     = useMemo(() => getTopGenres(topArtists, 4), [topArtists]);
  const scores        = useMemo(() => calculateMoodScores(topArtists), [topArtists]);
  const vibe          = useMemo(() => getVibeLabel(scores), [scores]);
  const { score: diversityScore, label: diversityLabel, rarities } =
    useMemo(() => calculateDiversityScore(topArtists), [topArtists]);

  const topArtist  = topArtists?.[0];
  const topTrack   = topTracks?.[0];
  const rarestArtist = rarities?.[0];
  const avatar     = user?.images?.[0]?.url;
  const estMins    = useMemo(() => estimatedMinutes(topTracks), [topTracks]);
  const genreCount = topGenres.length;

  return (
    <div className={styles.outer}>
      <div ref={cardRef} className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerIcon}>♪</span>
          <span className={styles.headerTitle}>MUSIC PERSONALITY</span>
        </div>

        {/* User */}
        <div className={styles.user}>
          {avatar
            ? <img src={avatar} alt="avatar" className={styles.avatar} crossOrigin="anonymous" />
            : <div className={styles.avatarFallback}>{user?.display_name?.[0]?.toUpperCase() || '♪'}</div>
          }
          <div className={styles.userInfo}>
            <div className={styles.displayName}>{user?.display_name || 'Music Lover'}</div>
            <div className={styles.userId}>@{user?.id || 'listener'}</div>
          </div>
        </div>

        {/* Personality type */}
        <div className={styles.personalityBlock}>
          <div className={styles.personalityLabel}>PERSONALITY TYPE</div>
          <div className={styles.personalityName}>
            {personality.emoji} {personality.name}
          </div>
        </div>

        {/* Quick stats row */}
        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <span className={styles.quickStatVal}>{formatMinutes(estMins)}</span>
            <span className={styles.quickStatLbl}>Est. Listening</span>
          </div>
          <div className={styles.quickStatDivider} />
          <div className={styles.quickStat}>
            <span className={styles.quickStatVal}>{genreCount}</span>
            <span className={styles.quickStatLbl}>Genres</span>
          </div>
          <div className={styles.quickStatDivider} />
          <div className={styles.quickStat}>
            <span className={styles.quickStatVal} style={{ color: diversityScore >= 55 ? '#8b5cf6' : 'var(--accent-green)' }}>
              {diversityScore}
            </span>
            <span className={styles.quickStatLbl}>{diversityLabel}</span>
          </div>
        </div>

        {/* Top genres */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>TOP GENRES</div>
          <div className={styles.genrePills}>
            {topGenres.map((g) => (
              <span key={g.genre} className={styles.genrePill}
                style={{ color: g.color, borderColor: `${g.color}50` }}>
                {g.genre}
              </span>
            ))}
          </div>
        </div>

        {/* #1 Artist + #1 Track */}
        <div className={styles.topItems}>
          {topArtist && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>#1 ARTIST</div>
              {topArtist.images?.[0]?.url
                ? <img src={topArtist.images[0].url} alt={topArtist.name}
                    className={styles.topItemImg} crossOrigin="anonymous" />
                : <div className={styles.topItemFallback}>{topArtist.name[0]}</div>
              }
              <div className={styles.topItemName}>{topArtist.name}</div>
            </div>
          )}
          {topTrack && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>#1 TRACK</div>
              {topTrack.album?.images?.[0]?.url
                ? <img src={topTrack.album.images[0].url} alt={topTrack.name}
                    className={styles.topItemImg} crossOrigin="anonymous" />
                : <div className={styles.topItemFallback}>♪</div>
              }
              <div className={styles.topItemName}>{topTrack.name}</div>
              <div className={styles.topItemSub}>{topTrack.artists?.[0]?.name}</div>
            </div>
          )}
          {rarestArtist && rarestArtist.id !== topArtist?.id && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>RAREST</div>
              {rarestArtist.images?.[0]?.url
                ? <img src={rarestArtist.images[0].url} alt={rarestArtist.name}
                    className={styles.topItemImg} crossOrigin="anonymous" />
                : <div className={styles.topItemFallback}>{rarestArtist.name[0]}</div>
              }
              <div className={styles.topItemName}>{rarestArtist.name}</div>
              <div className={styles.topItemSub}>{rarestArtist.popularity} pop.</div>
            </div>
          )}
        </div>

        {/* Mood row */}
        <div className={styles.moodRow}>
          {[
            { icon: '⚡', val: Math.round(scores.energy * 100),        lbl: 'Energy' },
            { icon: '😊', val: Math.round(scores.happiness * 100),     lbl: 'Happy' },
            { icon: '🕺', val: Math.round(scores.danceability * 100),  lbl: 'Dance' },
          ].map((m, i, arr) => (
            <Fragment key={m.lbl}>
              <div className={styles.moodItem}>
                <span className={styles.moodIcon}>{m.icon}</span>
                <span className={styles.moodValue}>{m.val}</span>
                <span className={styles.moodLbl}>{m.lbl}</span>
              </div>
              {i < arr.length - 1 && <div className={styles.moodDivider} />}
            </Fragment>
          ))}
        </div>

        <div className={styles.vibe}>Vibe: {vibe}</div>

        <div className={styles.footer}>Statify • Your Music DNA</div>
      </div>

      <button className="btn-primary" onClick={() => downloadPersonalityCard(cardRef)}>
        ↓ Download Card
      </button>
    </div>
  );
}
