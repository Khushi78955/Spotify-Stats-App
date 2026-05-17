import { useState, useEffect } from 'react';
import { isLoggedIn, logout as spotifyLogout, getValidToken } from './SpotifyAuth';

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    const check = async () => {
      const token = await getValidToken();
      setLoggedIn(!!token);
    };
    check();
  }, []);

  const logout = () => {
    spotifyLogout();
    setLoggedIn(false);
  };

  return { loggedIn, logout };
}
