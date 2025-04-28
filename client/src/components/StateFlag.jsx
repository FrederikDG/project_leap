import React from "react";
import "../styles/StateFlag.css";

// Show a colored flag for campaigns or flights, with an optional background color prop
export default function StateFlag({ type, state, color = "#82E184" }) {
  // Determine the style for the container
  const containerStyle = { backgroundColor: color };

  return (
    <>
      {type === "campaign" ? (
        <div className={`flag__container ${type}`} style={containerStyle}>
          <img className="icon" src="./LIGHTNING.svg" alt="lightning" />
          <p>campaign {state}</p>
        </div>
      ) : type === "flight" ? (
        <div className={`flag__container ${type}`} >
          <p>{state} flights</p>
        </div>
      ) : null}
    </>
  );
}
