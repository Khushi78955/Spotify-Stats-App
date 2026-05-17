import { useMemo } from 'react';
import { calculateMoodScores, getVibeLabel, getVibeColor } from '../utils/moodUtils';
import styles from './MoodScore.module.css';

function CircleProgress({ value, label, icon, color }) {
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;

  return (
    <div className={styles.circle}>
      <svg width={size} height={size} className={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className={styles.circleInner}>
        <span className={styles.circleIcon}>{icon}</span>
        <span className={styles.circleValue} style={{ color }}>
          {Math.round(value * 100)}
        </span>
      </div>
      <div className={styles.circleLabel}>{label}</div>
    </div>
  );
}

export default function MoodScore({ artists }) {
  const scores = useMemo(() => calculateMoodScores(artists), [artists]);
  const vibe = useMemo(() => getVibeLabel(scores), [scores]);
  const vibeColor = useMemo(() => getVibeColor(vibe), [vibe]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.vibe}>
        <span className={styles.vibeLabel}>Your Vibe</span>
        <span className={styles.vibeName} style={{ color: vibeColor }}>{vibe}</span>
      </div>
      <div className={styles.circles}>
        <CircleProgress
          value={scores.energy}
          label="Energy"
          icon="⚡"
          color="var(--accent-orange)"
        />
        <CircleProgress
          value={scores.happiness}
          label="Happiness"
          icon="😊"
          color="var(--accent-green)"
        />
        <CircleProgress
          value={scores.danceability}
          label="Dance"
          icon="🕺"
          color="var(--accent-purple)"
        />
      </div>
    </div>
  );
}
