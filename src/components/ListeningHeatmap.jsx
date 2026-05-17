import { useMemo } from 'react';
import styles from './ListeningHeatmap.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_LABELS = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'];

export default function ListeningHeatmap({ recentlyPlayed }) {
  const { grid, maxCount, peakLabel } = useMemo(() => {
    const g = Array.from({ length: 8 }, () => Array(7).fill(0));

    if (!recentlyPlayed?.items?.length) {
      return { grid: g, maxCount: 0, peakLabel: 'No data yet' };
    }

    for (const item of recentlyPlayed.items) {
      const d = new Date(item.played_at);
      const hour = d.getHours();
      const day = d.getDay();
      const slot = Math.floor(hour / 3);
      g[slot][day]++;
    }

    let maxCount = 0;
    let peakSlot = 0, peakDay = 0;
    for (let s = 0; s < 8; s++) {
      for (let d = 0; d < 7; d++) {
        if (g[s][d] > maxCount) {
          maxCount = g[s][d];
          peakSlot = s;
          peakDay = d;
        }
      }
    }

    const hourName = ['midnight', 'early morning', 'morning', 'late morning', 'noon', 'afternoon', 'evening', 'night'][peakSlot];
    const peakLabel = maxCount > 0
      ? `You listen most on ${DAYS[peakDay]} ${hourName}s`
      : 'No data yet';

    return { grid: g, maxCount, peakLabel };
  }, [recentlyPlayed]);

  function cellColor(count) {
    if (count === 0 || maxCount === 0) return 'rgba(255,255,255,0.04)';
    const intensity = count / maxCount;
    const alpha = 0.15 + intensity * 0.85;
    if (intensity > 0.75) return `rgba(29,185,84,${alpha})`;
    if (intensity > 0.4) return `rgba(29,185,84,${alpha * 0.7})`;
    return `rgba(29,185,84,${alpha * 0.4})`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.corner} />
        {DAYS.map((d) => (
          <div key={d} className={styles.dayLabel}>{d}</div>
        ))}
        {HOUR_LABELS.map((label, s) => (
          <>
            <div key={label} className={styles.hourLabel}>{label}</div>
            {DAYS.map((d, dayIdx) => (
              <div
                key={`${s}-${dayIdx}`}
                className={styles.cell}
                style={{ background: cellColor(grid[s][dayIdx]) }}
                title={`${d} ${label}: ${grid[s][dayIdx]} tracks`}
              />
            ))}
          </>
        ))}
      </div>
      <p className={styles.peak}>{peakLabel}</p>
    </div>
  );
}
