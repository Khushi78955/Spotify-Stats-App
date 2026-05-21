import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
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
  const [menuOpen, setMenuOpen]       = useState(false);
  const [scrollPct, setScrollPct]     = useState(0);
  const navRef                        = useRef(null);
  const indicatorRef                  = useRef(null);
  const linksRef                      = useRef(null);
  const location                      = useLocation();
  const avatar                        = user?.images?.[0]?.url;
  const closeMenu                     = () => setMenuOpen(false);

  // Scroll progress + navbar blur
  useEffect(() => {
    const onScroll = () => {
      const scrollY  = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollPct(maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0);
      if (navRef.current) {
        const blur = Math.min(8 + (scrollY / 100) * 16, 24);
        navRef.current.style.backdropFilter = `blur(${blur}px)`;
        navRef.current.style.webkitBackdropFilter = `blur(${blur}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animated underline indicator
  useLayoutEffect(() => {
    const links = linksRef.current;
    const indicator = indicatorRef.current;
    if (!links || !indicator) return;

    const activeLink = links.querySelector(`.${styles.active}`);
    if (!activeLink) {
      gsap.to(indicator, { opacity: 0, duration: 0.2 });
      return;
    }
    const linkRect = activeLink.getBoundingClientRect();
    const navRect  = links.getBoundingClientRect();

    gsap.to(indicator, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  }, [location.pathname]);

  return (
    <>
      {/* Scroll progress bar */}
      <div className={styles.progressBar} style={{ width: `${scrollPct}%` }} />

      <nav ref={navRef} className={styles.nav}>
        <div className={styles.inner}>
          <Link to="/dashboard" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoIcon}>♪</span>
            <span className={styles.logoText}>Statify</span>
          </Link>

          {/* Desktop links with sliding indicator */}
          <div className={styles.linksWrapper}>
            <div className={styles.links} ref={linksRef}>
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
            <div ref={indicatorRef} className={styles.indicator} style={{ opacity: 0 }} />
          </div>

          <div className={styles.right}>
            {user && <span className={styles.userName}>{user.display_name}</span>}
            {avatar
              ? <img src={avatar} alt="avatar" className={styles.avatar} />
              : <div className={styles.avatarFallback}>{user?.display_name?.[0]?.toUpperCase() || 'U'}</div>
            }
            <button className={styles.logout} onClick={logout} title="Logout">⏻</button>
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
