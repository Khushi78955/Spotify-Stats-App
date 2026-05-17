import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 40, color = 'var(--accent-green)' }) {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.spinner}
        style={{ width: size, height: size, borderColor: `${color}33`, borderTopColor: color }}
      />
    </div>
  );
}

export function SkeletonCard({ height = 120 }) {
  return <div className="skeleton" style={{ height, borderRadius: 'var(--radius)' }} />;
}

export function SkeletonText({ width = '100%', height = 16, mb = 8 }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: 4, marginBottom: mb }}
    />
  );
}
