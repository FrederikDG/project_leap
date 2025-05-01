import React, { useMemo } from 'react';
import '../styles/ProgressBar.css';
import { hsl } from 'd3-color';

const ProgressBar = ({ progress, color }) => {
  // derive darker and lighter variants just once per color change
  const { darkColor, lightColor } = useMemo(() => {
    const base = hsl(color);
    return {
      // tweak the factor (1) up or down to control darkness/lightness
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
            ${color} 50%,
            ${lightColor} 100%
          )`
        }}
      />
    </div>
  );
};

export default ProgressBar;
