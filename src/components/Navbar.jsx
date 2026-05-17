import { Link, NavLink } from 'react-router-dom';
import { logout } from '../auth/SpotifyAuth';
import styles from './Navbar.module.css';

export default function Navbar({ user }) {
  const avatar = user?.images?.[0]?.url;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>♪</span>
          <span className={styles.logoText}>Statify</span>
        </Link>

        <div className={styles.links}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tracks"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Top Tracks
          </NavLink>
          <NavLink
            to="/artists"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            Top Artists
          </NavLink>
        </div>

        <div className={styles.user}>
          {user && (
            <span className={styles.userName}>{user.display_name}</span>
          )}
          {avatar ? (
            <img src={avatar} alt="avatar" className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>
              {user?.display_name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <button className={styles.logout} onClick={logout} title="Logout">
            ⏻
          </button>
        </div>
      </div>
    </nav>
  );
}
