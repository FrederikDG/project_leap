import React from "react";
import "../styles/Footer.css";
import Button from "./Button";

const Footer = () => {
  // Define the scroll-to-top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"  // smooth scroll animation
    });
  };

  return (
    <footer>
      <div className="footer__container">
        <Button type="circle"  onClick={scrollToTop} image="./BUTTON_ARROW.svg" rotation="90"/>
        <div className="footer__text__container">
        <img className="footer__svg" src="THIS.svg" alt="THIS" />
        <p className="footer__text">Powered by This January</p></div>
      </div>
    </footer>
  );
};

export default Footer;
