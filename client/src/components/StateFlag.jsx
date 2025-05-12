import React from "react";
import "../styles/StateFlag.css";

// Show a colored flag for campaigns or flights, with an optional background color prop
export default function StateFlag({ type, state, count, name, color = "#82E184" }) {
  // Determine the style for the container
  if (state === "active") {
    color = color;
  } else if (state === "inactive") {
    color = "var(--color-grey-500)";
  } else if (state === "finished") {
    color = "var(--color-grey-400)";
  }
  const containerStyle = { backgroundColor: color };
  let icon;
  if (state === "active") {
    icon = "/LIGHTNING.svg";
  } else if (state === "inactive") {
    icon = "/INACTIVE.svg";
  } else if (state === "finished") {
    icon = "/FINISHED.svg";
  }

  if (type === "count" && count > 1) {
    name += "s";
  }
  return (
    <>
      {type === "state" ? (
        <div className={`flag__container ${type}`} style={containerStyle}>
          <img className="icon" src={icon} alt="state" />
          <p>{name} {state}</p>
        </div>
      ) : type === "count" ? (
        <div className={`flag__container ${type}`} >
          <p>{count} {name}</p>
        </div>
      ) : null}
    </>
  );
}
