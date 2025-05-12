// DataContainer.jsx
import React, { useState } from 'react';
import '../styles/DataContainer.css';

const DataContainer = ({ title, data, info }) => {
  const [iconHovered, setIconHovered] = useState(false);

  // only add the class when there's info *and* the icon is hovered
  const containerClass = iconHovered && info
    ? 'data__container info-hovered'
    : 'data__container';

  return (
    <div className={containerClass}>
      <span className="data__title">{title}</span>
      {info && <span className="data__info">{info}</span>}
      <span className="data__data">{data}</span>
      {info && (
        <img
          src="../INFO_ICON.svg"
          alt="Info icon"
          className="info__icon"
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
        />
      )}
    </div>
  );
};

export default DataContainer;
