import React, { useState, useEffect } from 'react';

function LoadingCircle({ isLoading, loadingTime = 12000 }) {
  const radius = 20;
  const totalCircumference = 2 * Math.PI * radius;

  const [offset, setOffset] = useState(totalCircumference); 

  const intervalDuration = loadingTime / (totalCircumference / 2.85); 
  const offsetDecrement = totalCircumference * intervalDuration / loadingTime;

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setOffset((prev) => prev - offsetDecrement);
      }, intervalDuration);
      return () => clearInterval(interval);
    } else {
      setOffset(totalCircumference);
    }
  }, [isLoading, offsetDecrement, intervalDuration]);

  return (
    <div className="loading-circle">
      <svg viewBox="0 0 100 100" width="120" height="120">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#00D9FF"
          strokeWidth="20"
          strokeDasharray={totalCircumference}
          strokeDashoffset={offset}
        />

        <defs>
          <filter id="fuzzyGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="5"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glowing static circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#00D9FF"
          strokeWidth="2"
          filter="url(#fuzzyGlow)"
        />

      <defs>
          <filter id="fuzzyGlow2" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="3"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glowing static circle 2 - needed for better glow */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#00D9FF"
          strokeWidth="2"
          filter="url(#fuzzyGlow2)"
        />
      </svg>
    </div>
  );
}

export default LoadingCircle;
