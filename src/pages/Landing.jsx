import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuthUrl, IS_DEMO_MODE } from '../auth/SpotifyAuth';
import { isLoggedIn } from '../auth/SpotifyAuth';
import styles from './Landing.module.css';

const AUTH_ERRORS = {
  auth_failed: 'Spotify login was cancelled or denied. Please try again.',
  token_failed: 'Could not exchange the login code for a token. Please try again.',
};

const PREVIEW_STATS = [
  { icon: '🎵', label: 'Top Tracks',   val: '50 tracked' },
  { icon: '🎤', label: 'Top Artists',  val: '50 tracked' },
  { icon: '🎭', label: 'Top Genre',    val: 'Pop' },
  { icon: '🕐', label: 'Recent Plays', val: '200 plays' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorKey = searchParams.get('error');
  const errorMsg = errorKey ? (AUTH_ERRORS[errorKey] ?? 'Authentication failed. Please try again.') : null;

  useEffect(() => {
    document.title = 'Statify — Your Music DNA';
    if (isLoggedIn()) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async () => {
    const url = await getAuthUrl();
    window.location.href = url;
  };

  return (
    <div className={styles.page}>
      {errorMsg && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠</span>
          {errorMsg}
        </div>
      )}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          stats.fm inspired
        </div>

        <h1 className={styles.headline}>
          Discover Your
          <span className={styles.highlight}> Music DNA</span>
        </h1>

        <p className={styles.sub}>
          Connect Spotify to see your top tracks, artists, genre breakdown,
          mood scores and a shareable personality card — all in one place.
        </p>

        {IS_DEMO_MODE && (
          <div style={{
            fontSize: 12, color: 'var(--text-muted)',
            padding: '8px 14px',
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 8,
            marginBottom: -8,
          }}>
            💡 No Client ID set — app will run in demo mode with sample data
          </div>
        )}

        <button className={styles.loginBtn} onClick={handleLogin}>
          <svg className={styles.spotifyIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Connect with Spotify
        </button>

        <p className={styles.disclaimer}>
          We only read your listening data — no posts, no changes.
        </p>

        <div className={styles.features}>
          {[
            { icon: '📊', title: 'Top Tracks & Artists', desc: 'See your most played music across 3 time ranges' },
            { icon: '🎭', title: 'Genre Breakdown', desc: 'Visualize your musical taste as an interactive cloud' },
            { icon: '🗓️', title: 'Listening Heatmap', desc: 'Discover when you listen most with a time grid' },
            { icon: '🎴', title: 'Personality Card', desc: 'Get a shareable card describing your music personality' },
          ].map((f) => (
            <div key={f.title} className={styles.feature}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div className={styles.featureText}>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* App preview mockup */}
        <div style={{
          marginTop: 8, width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden', opacity: 0.85,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}>
            {['#ef4444', '#f59e0b', '#1db954'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>statify.app/dashboard</span>
          </div>
          <div style={{ padding: '20px 16px', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {PREVIEW_STATS.map((s) => (
              <div key={s.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ fontFamily: 'Syne,sans-serif', fontSize: 18, fontWeight: 800 }}>{s.val}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
