import React, { useEffect, useState } from 'react';

/**
 * A tiny bar at the top of the page that shows scroll progress.
 * Uses the site's main gradient for the background.
 */
const ScrollProgressBar: React.FC = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScroll(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        width: `${scroll}%`,
        height: '3px', // set to 3px thick
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        background: 'linear-gradient(90deg, #ec4899 0%, #f59e42 100%)', // pink to orange
        transition: 'width 0.01s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgressBar;
