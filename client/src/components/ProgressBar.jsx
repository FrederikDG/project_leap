import React, { useMemo } from 'react';
import '../styles/ProgressBar.css';
import { hsl } from 'd3-color';

const ProgressBar = ({ startDate, endDate, color }) => {
  // Compute the progress based on the date range
  const progress = useMemo(() => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = end - start;
    const elapsed = now - start;

    if (now < start) return 0;
    if (now > end) return 100;

    return (elapsed / total) * 100;
  }, [startDate, endDate]);

  // Compute color shades
  const { darkColor, lightColor } = useMemo(() => {
    const base = hsl(color);
    return {
      darkColor: base.darker(1).toString(),
      lightColor: base.brighter(0.6).toString(),
    };
  }, [color]);

  return (
    <div className="progress__bar--background">
      <div
        className="progress__bar"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(
            to right,
            ${darkColor} 0%,
            ${color} 80%
          )`
        }}
      />
    </div>
  );
};

export default ProgressBar;
