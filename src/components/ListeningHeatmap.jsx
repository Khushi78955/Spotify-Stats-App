import { useMemo, useState, Fragment } from 'react';
import styles from './ListeningHeatmap.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const AXIS_HOURS = [0, 4, 8, 12, 16, 20];

function hourLabel(h) {
  if (h === 0)  return '12am';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export default function ListeningHeatmap({ recentlyPlayed }) {
  const [tooltip, setTooltip] = useState(null);

  const { grid, maxCount, peakLabel, totalTracks, dateRange } = useMemo(() => {
    const g = Array.from({ length: 24 }, () => Array(7).fill(0));
    const items = recentlyPlayed?.items ?? [];
    if (!items.length) return { grid: g, maxCount: 0, peakLabel: 'No data yet', totalTracks: 0, dateRange: null };

    let earliest = Infinity, latest = -Infinity;
    for (const item of items) {
      const d = new Date(item.played_at);
      const t = d.getTime();
      if (t < earliest) earliest = t;
      if (t > latest)   latest   = t;
      g[d.getHours()][d.getDay()]++;
    }

    let maxCount = 0, peakH = 0, peakD = 0;
    for (let h = 0; h < 24; h++)
      for (let d = 0; d < 7; d++)
        if (g[h][d] > maxCount) { maxCount = g[h][d]; peakH = h; peakD = d; }

    const peakLabel = maxCount > 0 ? `Peak: ${DAYS[peakD]}s around ${hourLabel(peakH)}` : 'No data yet';
    const fmt = (ts) => new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const dateRange = earliest !== Infinity ? `${fmt(earliest)} – ${fmt(latest)}` : null;

    return { grid: g, maxCount, peakLabel, totalTracks: items.length, dateRange };
  }, [recentlyPlayed]);

  function cellColor(count) {
    if (!count || !maxCount) return 'rgba(255,255,255,0.04)';
    const t = count / maxCount;
    if (t >= 0.75) return `rgba(29,185,84,${0.8 + t * 0.2})`;
    if (t >= 0.4)  return `rgba(29,185,84,${0.4 + t * 0.4})`;
    if (t >= 0.1)  return `rgba(29,185,84,${0.15 + t * 0.3})`;
    return 'rgba(29,185,84,0.1)';
  }

  return (
    <div className={styles.wrapper}>
      {tooltip && (
        <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.label}
        </div>
      )}

      <div className={styles.topRow}>
        <span className={styles.sample}>
          {totalTracks} plays sampled{dateRange ? ` · ${dateRange}` : ''}
        </span>
        <div className={styles.legend}>
          <span className={styles.legendTxt}>Less</span>
          {[0.04, 0.18, 0.42, 0.7, 1].map((v, i) => (
            <div key={i} className={styles.legendDot}
              style={{ background: v < 0.08 ? 'rgba(255,255,255,0.04)' : `rgba(29,185,84,${v})` }} />
          ))}
          <span className={styles.legendTxt}>More</span>
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.grid} style={{ boxShadow: '0 8px 32px rgba(29,185,84,0.15)' }}>
          <div className={styles.corner} />
          {DAYS.map((d) => <div key={d} className={styles.dayLabel}>{d}</div>)}

          {Array.from({ length: 24 }, (_, h) => (
            <Fragment key={h}>
              <div className={styles.hourLabel}>
                {AXIS_HOURS.includes(h) ? hourLabel(h) : ''}
              </div>
              {DAYS.map((_, di) => {
                const count = grid[h][di];
                const delay = (h * 7 + di) * 4;
                const isHot = maxCount > 0 && count / maxCount >= 0.75;
                return (
                  <div
                    key={`${h}-${di}`}
                    className={`${styles.cell} ${isHot ? styles.cellHot : ''}`}
                    style={{
                      background: cellColor(count),
                      animationDelay: `${delay}ms`,
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const wrap = e.currentTarget.closest('.' + styles.scroll);
                      const wRect = wrap?.getBoundingClientRect() || rect;
                      const rawX = rect.left - wRect.left + rect.width / 2;
                      setTooltip({
                        label: `${DAYS[di]} ${hourLabel(h)}: ${count} play${count !== 1 ? 's' : ''}`,
                        x: Math.max(30, Math.min(rawX, wRect.width - 30)),
                        y: rect.top - wRect.top - 32,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <p className={styles.peak}>
        {peakLabel}
        {maxCount > 0 && <span className={styles.peakNote}> · Spotify API returns ~200 recent plays max</span>}
      </p>
    </div>
  );
}
