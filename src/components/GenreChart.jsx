import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getTopGenres } from '../utils/genreUtils';
import styles from './GenreChart.module.css';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipGenre}>{d.genre}</span>
      <span className={styles.tooltipPct}>{d.pct}%</span>
      <span className={styles.tooltipCount}>{d.count} artists</span>
    </div>
  );
}

export default function GenreChart({ artists }) {
  const data = useMemo(() => {
    const genres = getTopGenres(artists, 8);
    const total = genres.reduce((s, g) => s + g.count, 0) || 1;
    return genres.map((g) => ({
      ...g,
      pct: Math.round((g.count / total) * 100),
    }));
  }, [artists]);

  if (!data.length) return <div className={styles.empty}>No genre data</div>;

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="genre"
            width={90}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((entry) => (
              <Cell key={entry.genre} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.pills}>
        {data.map((g) => (
          <div key={g.genre} className={styles.pill}>
            <span className={styles.pillDot} style={{ background: g.color }} />
            <span className={styles.pillName}>{g.genre}</span>
            <span className={styles.pillPct}>{g.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
