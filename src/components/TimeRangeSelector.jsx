import styles from './TimeRangeSelector.module.css';

const RANGES = [
  { label: '4 Weeks', value: 'short_term' },
  { label: '6 Months', value: 'medium_term' },
  { label: 'All Time', value: 'long_term' },
];

export default function TimeRangeSelector({ value, onChange }) {
  return (
    <div className={styles.tabs}>
      {RANGES.map((r) => (
        <button
          key={r.value}
          className={`${styles.tab} ${value === r.value ? styles.active : ''}`}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
