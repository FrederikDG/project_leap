import React, { useState, useEffect } from "react";
import "../styles/LoginButton.css";

export default function LoginButton({
  onClick = () => {},      // default noop
  text,
  animation = false,
  animationType = "right", // "right", "left", "up", or "down"
  image,
  animationTrigger = "click", // "click", "hover", or "both"
}) {
  const [animating, setAnimating] = useState(false);

  const triggerAnimation = () => {
    if (animation) setAnimating(true);
  };

  const handleClick = e => {
    if (animationTrigger === "click" || animationTrigger === "both") {
      triggerAnimation();
    }
    onClick(e);
  };

  const handleMouseEnter = () => {
    if (animationTrigger === "hover" || animationTrigger === "both") {
      triggerAnimation();
    }
  };

  // reset animating after duration
  useEffect(() => {
    let timeout;
    if (animating) {
      timeout = setTimeout(() => {
        setAnimating(false);
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [animating]);

  // determine the animation class
  const animClass = animating ? `animate-${animationType}` : "";

  return (
    <button
      className={`login__button ${animClass}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {text}
      <div className="icon-wrapper">
        {animating ? (
          <>
            <img
              src={image}
              alt="Old Icon"
              className="login__button__icon old"
            />
            <img
              src={image}
              alt="New Icon"
              className="login__button__icon new"
            />
          </>
        ) : (
          <img
            src={image}
            alt="Icon"
            className="login__button__icon current"
          />
        )}
      </div>
    </button>
  );
}
