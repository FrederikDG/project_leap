import React from "react";
import "../styles/DataContainer.css";
const DataContainer = ({ title, data, info, indicators }) => {
    const [showInfo, setShowInfo] = React.useState(false);

    return (
        <div
            className="data__container"
            
        >{showInfo && <span className="data__info">{info}</span>}
           {!showInfo && <span className="data__title">{title}</span>}
            <span className="data__data">{data}</span>
            {info && (
                <>
                    <img onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)} className="info__icon" src="../INFO_ICON.svg" alt="INFO ICON" />
                </>
            )}
        </div>
    );
};

export default DataContainer;
