import { useMemo } from 'react';
import { calculateDiversityScore } from '../utils/moodUtils';
import styles from './DiversityScore.module.css';

function GaugeBar({ label, value, color }) {
  return (
    <div className={styles.gaugeRow}>
      <span className={styles.gaugeLabel}>{label}</span>
      <div className={styles.gaugeTrack}>
        <div className={styles.gaugeFill} style={{ width: `${value}%`, background: color }} />
      </div>
      <span className={styles.gaugeValue}>{value}</span>
    </div>
  );
}

export default function DiversityScore({ artists }) {
  const { score, obscurityScore, genreScore, avgPopularity, label, rarities } =
    useMemo(() => calculateDiversityScore(artists), [artists]);

  const color =
    score >= 75 ? '#8b5cf6' :
    score >= 55 ? '#3b82f6' :
    score >= 35 ? '#1db954' :
    score >= 15 ? '#f59e0b' : '#ef4444';

  return (
    <div className={styles.wrapper}>
      <div className={styles.scoreRow}>
        <div className={styles.scoreBig} style={{ color }}>{score}</div>
        <div className={styles.scoreRight}>
          <div className={styles.scoreLabel} style={{ color }}>{label}</div>
          <div className={styles.scoreDesc}>
            Avg artist popularity: <strong>{avgPopularity}/100</strong>
          </div>
        </div>
      </div>

      <div className={styles.bars}>
        <GaugeBar label="Obscurity"     value={obscurityScore} color="#8b5cf6" />
        <GaugeBar label="Genre Breadth" value={genreScore}     color="#3b82f6" />
      </div>

      {rarities.length > 0 && (
        <div className={styles.rarities}>
          <div className={styles.raritiesTitle}>Your Rarest Listens</div>
          {rarities.map((a) => (
            <div key={a.id} className={styles.rarityRow}>
              {a.images?.[0]?.url
                ? <img src={a.images[0].url} alt={a.name} className={styles.rarityImg} />
                : <div className={styles.rarityFallback}>{a.name[0]}</div>
              }
              <div className={styles.rarityInfo}>
                <span className={styles.rarityName}>{a.name}</span>
                <span className={styles.rarityPop}>{a.popularity ?? '?'} popularity</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
