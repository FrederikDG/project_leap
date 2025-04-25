import React from "react";
import "../styles/Footer.css";
const Footer = () => {
  return (
    <footer>
      <div className="footer__container">
        <button>Go back up</button>
   
          <img className="footer__svg" src="THIS.svg" alt="THIS" />
          <p className="footer__text">Powered by This January</p>
   
      </div>
    </footer>
  );
};

export default Footer;
