import React, { useState, useRef, useEffect } from "react";
import "../styles/CompanyMenu.css";

const INITIAL_ICONS = [
  { id: "gravity", src: "./GRVTY_PH.png",  alt: "Gravity Photo" },
  { id: "dcc",     src: "./DCC_PH.png",    alt: "DC Camera Photo" },
  { id: "fellow",  src: "./FELLOW_PH.png", alt: "Fellow Photo" },
  { id: "bonkers", src: "./BONKERS_PH.png", alt: "Bonkers Photo" },
  { id: "CTIA",    src: "./CTIA_PH.png",    alt: "CTIA Photo" },
  { id: "CBIZ",    src: "./CBIZ_PH.png",    alt: "CBIZ Photo" },
];

export default function CompanyMenu() {
  const [open, setOpen]   = useState(false);
  const [order, setOrder] = useState(INITIAL_ICONS.map(i => i.id));
  const menuRef = useRef(null);

  const toggleMenu = () => setOpen(o => !o);

  const handleClick = id => {
    if (order[0] === id) {
      toggleMenu();
      return;
    }
    setOrder(prev => {
      const copy = prev.filter(x => x !== id);
      copy.unshift(id);
      return copy;
    });
  };



  // click-outside handler
  useEffect(() => {
    const onClickOutside = e => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="company__menu" ref={menuRef}>
      {INITIAL_ICONS.map(icon => {
        const pos = order.indexOf(icon.id);
        const transform =
          pos > 0
            ? open
              ? `translateX(-${pos * 4}rem)`
              : "translateX(0)"
            : undefined;
        const zIndex = order.length + 1 - pos;

        return (
          <button
            key={icon.id}
            className={
              "company__button " +
              (pos === 0 ? "trigger" : "item") +
              (open ? " visible" : "")
            }
            style={{
              zIndex,
              ...(transform && { transform }),
            }}
            onClick={() => handleClick(icon.id)}
          >
            <img src={icon.src} alt={icon.alt} />
          </button>
        );
      })}
    </div>
  );
}
