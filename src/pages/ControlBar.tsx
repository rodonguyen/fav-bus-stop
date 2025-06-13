import React, { useEffect, useState } from 'react';

import { AddButton } from '../components/AddButton';
import ThemeToggle from '../components/ThemeToggle';

interface ControlBarProps {
  progress: number;
  isAddingStop: boolean;
  setIsAddingStop: (v: boolean) => void;
}

const ControlBar: React.FC<ControlBarProps> = ({ progress, isAddingStop, setIsAddingStop }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = 100;
      const progress = Math.min(scrollPosition / maxScroll, 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getScale = () => {
    const minScale = 0.7;
    const scale = 1 - scrollProgress * (1 - minScale);
    return scale;
  };

  return (
    <div
      className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-sm transition-all duration-200"
      style={{
        paddingTop: `${16 * (1 - scrollProgress)}px`,
        paddingBottom: `${16 * (1 - scrollProgress)}px`,
      }}
    >
      <div className="flex justify-between items-center transition-all duration-200">
        <ThemeToggle style={{ transform: `scale(${getScale()})` }} />
        <div className="flex items-center gap-3">
          <RefreshProgressCircle
            style={
              {
                '--value': progress,
                '--size': '2.4rem',
                '--thickness': '0.6rem',
                transform: `scale(${getScale()})`,
              } as React.CSSProperties
            }
          />
          <AddButton
            className="my-auto transition-all duration-200"
            style={{ transform: `scale(${getScale()})` }}
            isAddingStop={isAddingStop}
            onClick={() => setIsAddingStop(!isAddingStop)}
          />
        </div>
      </div>
    </div>
  );
};

const RefreshProgressCircle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return <div className="radial-progress text-primary transition-all duration-200" {...props}></div>;
};

export default ControlBar;
