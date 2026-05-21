import { useRef, useMemo, useEffect, useCallback } from 'react';
import { downloadPersonalityCard, sharePersonalityCard, canShare } from '../utils/exportUtils';
import { getTopGenres } from '../utils/genreUtils';
import { calculateMoodScores, calculateMoodFromAudioFeatures, getVibeLabel, calculateDiversityScore } from '../utils/moodUtils';
import { useTilt } from '../hooks/useTilt';
import styles from './PersonalityCard.module.css';

const PERSONALITIES = {
  mainstream: { name: 'The Trendsetter',        emoji: '🔥', gradient: 'linear-gradient(135deg,#f97316,#ef4444)', accent: '#f97316' },
  eclectic:   { name: 'The Eclectic Explorer',   emoji: '🗺️', gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', accent: '#8b5cf6' },
  electronic: { name: 'The Night Owl',           emoji: '🦉', gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', accent: '#3b82f6' },
  hiphop:     { name: 'The Rhythm Rider',        emoji: '🎤', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', accent: '#f59e0b' },
  rock:       { name: 'The Headbanger',          emoji: '🤘', gradient: 'linear-gradient(135deg,#ef4444,#991b1b)', accent: '#ef4444' },
  indie:      { name: 'The Hidden Gem Hunter',   emoji: '💎', gradient: 'linear-gradient(135deg,#06b6d4,#0e7490)', accent: '#06b6d4' },
  classical:  { name: 'The Sophisticated Soul',  emoji: '🎼', gradient: 'linear-gradient(135deg,#d97706,#92400e)', accent: '#d97706' },
  rnb:        { name: 'The Smooth Operator',     emoji: '🎶', gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)', accent: '#ec4899' },
  chill:      { name: 'The Zen Master',          emoji: '🧘', gradient: 'linear-gradient(135deg,#06b6d4,#1db954)', accent: '#06b6d4' },
  pop:        { name: 'The Chart Surfer',        emoji: '📈', gradient: 'linear-gradient(135deg,#1db954,#059669)', accent: '#1db954' },
  latin:      { name: 'The Rhythm Ambassador',   emoji: '💃', gradient: 'linear-gradient(135deg,#f97316,#ec4899)', accent: '#f97316' },
  jazz:       { name: 'The Late Night Thinker',  emoji: '🌙', gradient: 'linear-gradient(135deg,#6b7280,#8b5cf6)', accent: '#8b5cf6' },
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
  return Math.round((avgMs * tracks.length * 20) / 60000);
}

function formatMinutes(mins) {
  if (mins >= 1440) return `${Math.round(mins / 1440)}d`;
  if (mins >= 60)   return `${Math.round(mins / 60)}h`;
  return `${mins}m`;
}

// Floating particle canvas behind card content
function ParticleCanvas({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth  || 400;
    canvas.height = canvas.offsetHeight || 500;

    const particles = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 16 + Math.random() * 20,
      vy: -(0.2 + Math.random() * 0.4),
      vx: (Math.random() - 0.5) * 0.15,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,0.07)`;
        ctx.fill();
        p.y += p.vy;
        p.x += p.vx;
        if (p.y + p.r < 0) { p.y = canvas.height + p.r; p.x = Math.random() * canvas.width; }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [canvasRef]);

  return null;
}

export default function PersonalityCard({ user, topTracks, topArtists, audioFeatures }) {
  const cardRef   = useRef(null);
  const outerRef  = useTilt(5);
  const particleCanvasRef = useRef(null);

  const personality   = useMemo(() => getPersonality(topArtists), [topArtists]);
  const topGenres     = useMemo(() => getTopGenres(topArtists, 4), [topArtists]);
  const scores        = useMemo(
    () => calculateMoodFromAudioFeatures(audioFeatures) ?? calculateMoodScores(topArtists),
    [topArtists, audioFeatures],
  );
  const vibe          = useMemo(() => getVibeLabel(scores), [scores]);
  const { score: diversityScore, label: diversityLabel, rarities } =
    useMemo(() => calculateDiversityScore(topArtists), [topArtists]);

  const topArtist    = topArtists?.[0];
  const topTrack     = topTracks?.[0];
  const rarestArtist = rarities?.[0];
  const avatar       = user?.images?.[0]?.url;
  const estMins      = useMemo(() => estimatedMinutes(topTracks), [topTracks]);

  const handleDownload = useCallback(async () => {
    // Hide particle canvas before capture, restore after
    const pc = particleCanvasRef.current;
    if (pc) pc.style.display = 'none';
    await downloadPersonalityCard(cardRef);
    if (pc) pc.style.display = 'block';
  }, []);

  const handleShare = useCallback(async () => {
    const pc = particleCanvasRef.current;
    if (pc) pc.style.display = 'none';
    await sharePersonalityCard(cardRef);
    if (pc) pc.style.display = 'block';
  }, []);

  return (
    <div className={styles.outer} ref={outerRef}>
      <div
        ref={cardRef}
        className={styles.card}
        style={{ '--personality-gradient': personality.gradient, '--accent': personality.accent }}
      >
        {/* Floating particle canvas */}
        <canvas
          ref={particleCanvasRef}
          className={styles.particleCanvas}
          aria-hidden="true"
        />
        <ParticleCanvas canvasRef={particleCanvasRef} />

        {/* Gradient accent bar */}
        <div className={styles.accentBar} style={{ background: personality.gradient }} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>♪</span>
            <span className={styles.headerTitle}>STATIFY</span>
          </div>
          <span className={styles.headerSub}>MUSIC PERSONALITY</span>
        </div>

        {/* User + personality badge */}
        <div className={styles.heroRow}>
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

          <div className={styles.personalityBadge}>
            <span className={styles.personalityEmoji}>{personality.emoji}</span>
            <span
              className={styles.personalityName}
              style={{ textShadow: `0 0 40px ${personality.accent}80` }}
            >
              {personality.name}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <span className={styles.quickStatVal}>{formatMinutes(estMins)}</span>
            <span className={styles.quickStatLbl}>Est. Listening</span>
          </div>
          <div className={styles.quickStatDivider} />
          <div className={styles.quickStat}>
            <span className={styles.quickStatVal}>{topGenres.length}</span>
            <span className={styles.quickStatLbl}>Genres</span>
          </div>
          <div className={styles.quickStatDivider} />
          <div className={styles.quickStat}>
            <span className={styles.quickStatVal} style={{ color: diversityScore >= 55 ? '#8b5cf6' : '#1db954' }}>
              {diversityScore}
            </span>
            <span className={styles.quickStatLbl}>{diversityLabel}</span>
          </div>
        </div>

        {/* Genre pills */}
        {topGenres.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>TOP GENRES</div>
            <div className={styles.genrePills}>
              {topGenres.map((g) => (
                <span key={g.genre} className={styles.genrePill}
                  style={{ color: g.color, borderColor: `${g.color}50`, background: `${g.color}12` }}>
                  {g.genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Top items */}
        <div className={styles.topItems}>
          {topArtist && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>#1 ARTIST</div>
              {topArtist.images?.[0]?.url
                ? <img src={topArtist.images[0].url} alt={topArtist.name} className={styles.topItemImg} crossOrigin="anonymous" />
                : <div className={styles.topItemFallback}>{topArtist.name[0]}</div>
              }
              <div className={styles.topItemName}>{topArtist.name}</div>
            </div>
          )}
          {topTrack && (
            <div className={styles.topItem}>
              <div className={styles.topItemLabel}>#1 TRACK</div>
              {topTrack.album?.images?.[0]?.url
                ? <img src={topTrack.album.images[0].url} alt={topTrack.name} className={styles.topItemImg} crossOrigin="anonymous" />
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
                ? <img src={rarestArtist.images[0].url} alt={rarestArtist.name} className={styles.topItemImg} crossOrigin="anonymous" />
                : <div className={styles.topItemFallback}>{rarestArtist.name[0]}</div>
              }
              <div className={styles.topItemName}>{rarestArtist.name}</div>
              <div className={styles.topItemSub}>{rarestArtist.popularity} pop.</div>
            </div>
          )}
        </div>

        {/* Mood bars */}
        <div className={styles.moodSection}>
          <div className={styles.sectionLabel}>MOOD PROFILE</div>
          <div className={styles.moodBars}>
            {[
              { icon: '⚡', label: 'Energy',    val: scores.energy,       color: '#f97316' },
              { icon: '😊', label: 'Happiness', val: scores.happiness,    color: '#1db954' },
              { icon: '🕺', label: 'Dance',     val: scores.danceability, color: '#8b5cf6' },
            ].map((m) => (
              <div key={m.label} className={styles.moodBar}>
                <span className={styles.moodBarIcon}>{m.icon}</span>
                <span className={styles.moodBarLabel}>{m.label}</span>
                <div className={styles.moodBarTrack}>
                  <div className={styles.moodBarFill} style={{ width: `${Math.round(m.val*100)}%`, background: m.color }} />
                </div>
                <span className={styles.moodBarVal} style={{ color: m.color }}>{Math.round(m.val*100)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.vibe}>Vibe: <strong>{vibe}</strong></div>

        <div className={styles.footer}>
          <span>Statify · Your Music DNA</span>
          <span style={{ opacity: 0.4 }}>statify.app</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn-primary" onClick={handleDownload}>↓ Download Card</button>
        {canShare() && <button className="btn-secondary" onClick={handleShare}>↑ Share</button>}
      </div>
    </div>
  );
}
