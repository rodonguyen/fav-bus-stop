import { useCallback, useEffect, useState } from 'react';

interface UseRefreshTimerProps {
  duration?: number; // Duration in milliseconds
  onComplete?: () => void;
  autoStart?: boolean;
}

const useRefreshTimer = ({
  duration = 5000, // 5 seconds default
  onComplete,
  autoStart = true,
}: UseRefreshTimerProps = {}) => {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const [startTime, setStartTime] = useState<number | null>(autoStart ? Date.now() : null);

  const start = useCallback(() => {
    setStartTime(Date.now());
    setIsActive(true);
    setProgress(0);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setStartTime(null);
    setProgress(0);
  }, []);

  const reset = useCallback(() => {
    if (isActive) {
      start();
    } else {
      stop();
    }
  }, [isActive, start, stop]);

  useEffect(() => {
    if (!isActive || !startTime) return;

    let animationFrameId: number;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(Math.round(newProgress));

      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // When complete, stop the timer and call onComplete
        setIsActive(false);
        if (onComplete) {
          onComplete();
          // Only restart if still mounted and active
          if (isActive) {
            start();
          }
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, isActive, onComplete, start, startTime]);

  return {
    progress,
    isActive,
    start,
    stop,
    reset,
    timeLeft: Math.max(0, duration - (startTime ? Date.now() - startTime : 0)),
    elapsedTime: startTime ? Date.now() - startTime : 0,
  };
};

export default useRefreshTimer;
