import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { logout } from '../auth/SpotifyAuth';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tracks',    label: 'Top Tracks' },
  { to: '/artists',   label: 'Top Artists' },
  { to: '/genres',    label: 'Genres' },
  { to: '/stats',     label: 'Stats' },
];

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const avatar = user?.images?.[0]?.url;
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.inner}>
          <Link to="/dashboard" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoIcon}>♪</span>
            <span className={styles.logoText}>Statify</span>
          </Link>

          {/* Desktop links */}
          <div className={styles.links}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className={styles.right}>
            {user && <span className={styles.userName}>{user.display_name}</span>}
            {avatar
              ? <img src={avatar} alt="avatar" className={styles.avatar} />
              : <div className={styles.avatarFallback}>{user?.display_name?.[0]?.toUpperCase() || 'U'}</div>
            }
            <button className={styles.logout} onClick={logout} title="Logout">⏻</button>

            {/* Hamburger (mobile only) */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
              onClick={closeMenu}
            >
              {label}
            </NavLink>
          ))}
          <button className={styles.mobileLogout} onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}
