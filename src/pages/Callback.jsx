import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../auth/SpotifyAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Callback() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (error || !code) {
      navigate('/?error=auth_failed');
      return;
    }

    exchangeCodeForToken(code)
      .then(() => navigate('/dashboard'))
      .catch(() => navigate('/?error=token_failed'));
  }, [navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
      <LoadingSpinner size={48} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Connecting to Spotify…</p>
    </div>
  );
}
