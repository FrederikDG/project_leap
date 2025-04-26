import React from "react";
import "../styles/CircleButton.css";

export default function CircleButton({
  text,
  image,
  rotation = 0,
  onClick,
}) {
  return (
    <button
      type="button"
      className="circle__button"
      onClick={onClick}
    >
      <img
        src={image}
        alt="button image"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      {text}
    </button>
  );
}
