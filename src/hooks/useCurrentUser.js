import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/spotify';
import { MOCK_USER } from '../api/mockData';

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    getUserProfile().then(setUser).catch(() => setUser(MOCK_USER));
  }, []);
  return user;
}
