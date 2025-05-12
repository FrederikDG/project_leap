import React from "react";
import "../styles/Button.css";

export default function Button({ type, text, image, rotation = 0, onClick }) {
  return (
    <button type="button" className={type === "text" ? "text__button" : "circle__button"} onClick={onClick}>
      {image && <img src={image} alt="button image" style={{ transform: `rotate(${rotation}deg)` }} />}
      {text}
    </button>
  );
}
