import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const innerRef = useRef(null);
  const outerRef = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const outerPos = useRef({ x: -200, y: -200 });
  const modeRef = useRef('default');

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      inner.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const tick = () => {
      outerPos.current.x += (mouse.current.x - outerPos.current.x) * 0.12;
      outerPos.current.y += (mouse.current.y - outerPos.current.y) * 0.12;
      outer.style.transform = `translate(${outerPos.current.x - 18}px, ${outerPos.current.y - 18}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setMode = (mode) => {
      modeRef.current = mode;
      outer.className = `${styles.outer} ${mode === 'button' ? styles.outerButton : mode === 'card' ? styles.outerCard : ''}`;
    };

    const onEnter = (e) => {
      const t = e.target;
      if (t.closest('button') || t.closest('a')) setMode('button');
      else if (t.closest('.card')) setMode('card');
    };
    const onLeave = () => setMode('default');

    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={innerRef} className={styles.inner} />
      <div ref={outerRef} className={styles.outer} />
    </>
  );
}
