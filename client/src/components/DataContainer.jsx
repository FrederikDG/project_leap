// DataContainer.jsx
import React, { useState } from 'react';
import '../styles/DataContainer.css';

const DataContainer = ({ title, data, info }) => {
  const [iconHovered, setIconHovered] = useState(false);

  // only add the class when there's info *and* the icon is hovered
  const containerClass = iconHovered && info
    ? 'data__container info-hovered'
    : 'data__container';

  // Format date if data is in yyyy-mm-dd format
  const formatDate = (data) => {
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [year, month, day] = data.split('-');
      return `${month}/${day}/${year}`;
    }
    return data;
  };

  const displayData = formatDate(data);

  return (
    <div className={containerClass}>
      <span className="data__title">{title}</span>
      {info && <span className="data__info">{info}</span>}
      <span className="data__data">{displayData}</span>
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
