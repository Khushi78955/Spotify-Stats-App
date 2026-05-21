import { useState, useEffect } from 'react';

/**
 * Generic hook for Spotify API calls with loading, error, and mock fallback.
 * @param {Function} fetchFn  async function that returns data
 * @param {*}        fallback value to use when fetchFn throws
 * @param {Array}    deps     extra useEffect dependencies (e.g. [timeRange])
 */
export function useSpotifyData(fetchFn, fallback, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn();
        if (mounted) setData(result);
      } catch (err) {
        if (mounted) {
          setData(fallback ?? null);
          setError(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
