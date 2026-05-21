import { useState, useEffect } from 'react';
import { getValidToken } from '../auth/SpotifyAuth';
import styles from './ArtistModal.module.css';

async function fetchArtistDetails(artistId) {
  const token = await getValidToken();
  if (!token) return null;
  const headers = { Authorization: `Bearer ${token}` };
  const [topTracks, related] = await Promise.all([
    fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, { headers }).then((r) => r.json()),
    fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, { headers }).then((r) => r.json()),
  ]);
  return {
    topTracks: topTracks.tracks?.slice(0, 5) || [],
    related:   related.artists?.slice(0, 6) || [],
  };
}

export default function ArtistModal({ artist, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artist) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      setDetails(null);
      const d = await fetchArtistDetails(artist.id);
      if (mounted) { setDetails(d); setLoading(false); }
    }
    load();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { mounted = false; window.removeEventListener('keydown', onKey); };
  }, [artist, onClose]);

  if (!artist) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${artist.name} details`}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.header}>
          {artist.images?.[0]?.url
            ? <img src={artist.images[0].url} alt={artist.name} className={styles.img} />
            : <div className={styles.imgFallback}>{artist.name[0]}</div>
          }
          <div className={styles.meta}>
            <h2 className={styles.name}>{artist.name}</h2>
            <div className={styles.genres}>
              {artist.genres?.slice(0, 3).map((g) => (
                <span key={g} className={styles.genre}>{g}</span>
              ))}
            </div>
            <div className={styles.stats}>
              <span>{(artist.followers?.total || 0).toLocaleString()} followers</span>
              <span>{artist.popularity}/100 popularity</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading details…</div>
        ) : (
          <>
            {details?.topTracks?.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Top Tracks</h3>
                {details.topTracks.map((t, i) => (
                  <div key={t.id} className={styles.track}>
                    <span className={styles.trackNum}>{i + 1}</span>
                    {t.album?.images?.[0]?.url && (
                      <img src={t.album.images[0].url} alt={t.name} className={styles.trackImg} loading="lazy" />
                    )}
                    <span className={styles.trackName}>{t.name}</span>
                    <span className={styles.trackPop}>{t.popularity}</span>
                  </div>
                ))}
              </div>
            )}

            {details?.related?.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Related Artists</h3>
                <div className={styles.related}>
                  {details.related.map((a) => (
                    <div key={a.id} className={styles.relatedArtist}>
                      {a.images?.[0]?.url
                        ? <img src={a.images[0].url} alt={a.name} className={styles.relatedImg} loading="lazy" />
                        : <div className={styles.relatedFallback}>{a.name[0]}</div>
                      }
                      <span className={styles.relatedName}>{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
