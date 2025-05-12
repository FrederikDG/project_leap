import "../styles/Button.css";
import React, { useEffect, useRef, useState } from "react";

export default function Button({ type, text, image, rotation = 0, onClick, transition = false }) {
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const prevRotation = useRef(rotation);

  useEffect(() => {
    prevRotation.current = rotation;
    setCurrentRotation(rotation);
  }, [rotation]);

  const handleClick = (e) => {
    if (transition) {
      setCurrentRotation((prev) => prev + 180); // Rotate 90deg on each click
    }
    if (onClick) onClick(e);
  };

  const imgStyle = {
    transform: `rotate(${currentRotation}deg)`,
    transition: transition ? "transform 0.3s ease" : undefined,
  };

  return (
    <button
      type="button"
      className={type === "text" ? "text__button" : "circle__button"}
      onClick={handleClick}
    >
      {image && <img src={image} alt="button image" style={imgStyle} />}
      {text}
    </button>
  );
}
