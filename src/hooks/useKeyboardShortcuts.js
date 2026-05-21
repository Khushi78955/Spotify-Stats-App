import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../auth/SpotifyAuth';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) return;
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key.toLowerCase()) {
        case 'd': navigate('/dashboard'); break;
        case 't': navigate('/tracks');   break;
        case 'a': navigate('/artists');  break;
        case 'g': navigate('/genres');   break;
        case 's': navigate('/stats');    break;
        default: break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);
}
