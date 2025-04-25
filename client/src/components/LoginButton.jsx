import React, { useState, useEffect } from "react";
import "../styles/LoginButton.css";

export default function LoginButton({
  text,
  animation = false,
  animationType = "right",
  image,
  animationTrigger = "click",
}) {


  return (
    <button
      className="login__button"
    >  <img
              src={image}
              alt="Old Icon"
              className="login__button__icon old"
            />
      {text}
    </button>
  );
}
