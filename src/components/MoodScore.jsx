import { useMemo, useState, useEffect } from 'react';
import { calculateMoodScores, calculateMoodFromAudioFeatures, getVibeLabel, getVibeColor } from '../utils/moodUtils';
import { useCountUp } from '../hooks/useCountUp';
import styles from './MoodScore.module.css';

function CircleProgress({ value, label, icon, color }) {
  const [animate, setAnimate] = useState(false);
  const countedVal = useCountUp(Math.round(value * 100));

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - value * circumference;

  return (
    <div className={styles.circle}>
      <svg width={size} height={size} className={styles.svg}>
        {/* Rotating outer ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius + 6}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={2}
          className={styles.outerRing}
        />
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? targetOffset : circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={styles.arc}
        />
      </svg>
      <div className={styles.circleInner}>
        <span className={styles.circleIcon}>{icon}</span>
        <span className={styles.circleValue} style={{ color }}>{countedVal}</span>
      </div>
      <div className={styles.circleLabel}>{label}</div>
    </div>
  );
}

export default function MoodScore({ artists, audioFeatures }) {
  const scores = useMemo(
    () => calculateMoodFromAudioFeatures(audioFeatures) ?? calculateMoodScores(artists),
    [artists, audioFeatures],
  );
  const isReal = !!(audioFeatures?.length);
  const vibe = useMemo(() => getVibeLabel(scores), [scores]);
  const vibeColor = useMemo(() => getVibeColor(vibe), [vibe]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.vibe}>
        <span className={styles.vibeLabel}>Your Vibe</span>
        <span className={styles.vibeName} style={{ color: vibeColor }}>{vibe}</span>
        <span className={styles.vibeSource}>{isReal ? '● real data' : '● genre estimate'}</span>
      </div>
      <div className={styles.circles}>
        <CircleProgress value={scores.energy}       label="Energy"    icon="⚡" color="var(--accent-orange)" />
        <CircleProgress value={scores.happiness}    label="Happiness" icon="😊" color="var(--accent-green)" />
        <CircleProgress value={scores.danceability} label="Dance"     icon="🕺" color="var(--accent-purple)" />
      </div>
    </div>
  );
}
