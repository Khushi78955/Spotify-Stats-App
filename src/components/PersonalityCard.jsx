import { useRef, useMemo } from 'react';
import { downloadPersonalityCard } from '../utils/exportUtils';
import { getTopGenres, categorizeGenre } from '../utils/genreUtils';
import { calculateMoodScores, getVibeLabel } from '../utils/moodUtils';
import styles from './PersonalityCard.module.css';

const PERSONALITIES = {
  mainstream: { name: 'The Trendsetter', emoji: '🔥' },
  eclectic:   { name: 'The Eclectic Explorer', emoji: '🗺️' },
  electronic: { name: 'The Night Owl', emoji: '🦉' },
  hiphop:     { name: 'The Rhythm Rider', emoji: '🎤' },
  rock:       { name: 'The Headbanger', emoji: '🤘' },
  indie:      { name: 'The Hidden Gem Hunter', emoji: '💎' },
  classical:  { name: 'The Sophisticated Soul', emoji: '🎼' },
  rnb:        { name: 'The Smooth Operator', emoji: '🎶' },
  chill:      { name: 'The Zen Master', emoji: '🧘' },
};

function getPersonality(artists) {
  if (!artists?.length) return PERSONALITIES.eclectic;
  const genres = getTopGenres(artists, 5);
  if (!genres.length) return PERSONALITIES.eclectic;
  const topCat = genres[0].category;
  return PERSONALITIES[topCat] || PERSONALITIES.eclectic;
}

export default function PersonalityCard({ user, topTracks, topArtists }) {
  const cardRef = useRef(null);

  const personality = useMemo(() => getPersonality(topArtists), [topArtists]);
  const topGenres = useMemo(() => getTopGenres(topArtists, 4), [topArtists]);
  const scores = useMemo(() => calculateMoodScores(topArtists), [topArtists]);
  const vibe = useMemo(() => getVibeLabel(scores), [scores]);

  const topArtist = topArtists?.[0];
  const topTrack = topTracks?.[0];
  const avatar = user?.images?.[0]?.url;

  const handleDownload = () => downloadPersonalityCard(cardRef);

  return (
    <div className={styles.outer}>
      <div ref={cardRef} className={styles.card}>
        <div className={styles.header}>
          <span className={styles.headerIcon}>♪</span>
          <span className={styles.headerTitle}>MUSIC PERSONALITY</span>
        </div>

        <div className={styles.user}>
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className={styles.avatar}
              crossOrigin="anonymous"
            />
          ) : (
            <div className={styles.avatarFallback}>
              {user?.display_name?.[0]?.toUpperCase() || '♪'}
            </div>
          )}
          <div className={styles.userInfo}>
            <div className={styles.displayName}>{user?.display_name || 'Music Lover'}</div>
            <div className={styles.userId}>@{user?.id || 'listener'}</div>
          </div>
        </div>

        <div className={styles.personalityBlock}>
          <div className={styles.personalityLabel}>PERSONALITY TYPE</div>
          <div className={styles.personalityName}>
            {personality.emoji} {personality.name}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>TOP GENRES</div>
          <div className={styles.genrePills}>
            {topGenres.slice(0, 4).map((g) => (
              <span key={g.genre} className={styles.genrePill} style={{ color: g.color, borderColor: `${g.color}50` }}>
                {g.genre}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.topItems}>
          {topArtist && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>#1 ARTIST</div>
              {topArtist.images?.[0]?.url ? (
                <img
                  src={topArtist.images[0].url}
                  alt={topArtist.name}
                  className={styles.topItemImg}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className={styles.topItemImgFallback}>{topArtist.name[0]}</div>
              )}
              <div className={styles.topItemName}>{topArtist.name}</div>
            </div>
          )}
          {topTrack && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>#1 TRACK</div>
              {topTrack.album?.images?.[0]?.url ? (
                <img
                  src={topTrack.album.images[0].url}
                  alt={topTrack.name}
                  className={styles.topItemImg}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className={styles.topItemImgFallback}>♪</div>
              )}
              <div className={styles.topItemName}>{topTrack.name}</div>
              <div className={styles.topItemSub}>{topTrack.artists?.[0]?.name}</div>
            </div>
          )}
        </div>

        <div className={styles.moodRow}>
          <div className={styles.moodItem}>
            <span className={styles.moodIcon}>⚡</span>
            <span className={styles.moodValue}>{Math.round(scores.energy * 100)}</span>
            <span className={styles.moodLbl}>Energy</span>
          </div>
          <div className={styles.moodDivider} />
          <div className={styles.moodItem}>
            <span className={styles.moodIcon}>😊</span>
            <span className={styles.moodValue}>{Math.round(scores.happiness * 100)}</span>
            <span className={styles.moodLbl}>Happy</span>
          </div>
          <div className={styles.moodDivider} />
          <div className={styles.moodItem}>
            <span className={styles.moodIcon}>🕺</span>
            <span className={styles.moodValue}>{Math.round(scores.danceability * 100)}</span>
            <span className={styles.moodLbl}>Dance</span>
          </div>
        </div>

        <div className={styles.vibe}>Vibe: {vibe}</div>

        <div className={styles.footer}>
          Statify • Your Music DNA
        </div>
      </div>

      <button className="btn-primary" onClick={handleDownload}>
        ↓ Download Card
      </button>
    </div>
  );
}
