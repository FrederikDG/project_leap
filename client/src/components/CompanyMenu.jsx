import React, { useState, useRef, useEffect, useContext } from "react";
import "../styles/CompanyMenu.css";
import Modal from "./Modal";
import { CompanyContext } from "../context/CompanyContext";

export default function CompanyMenu() {
  const { companies, order, selectCompany, addCompany } = useContext(CompanyContext);
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#000000");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const menuRef = useRef(null);

  
  const icons = [
    ...companies.map(c => ({
      id: c.id,
      src: c.profilePic ? URL.createObjectURL(c.profilePic) : undefined,
      alt: c.name,
      color: c.color,
      isAdd: false,
      name: c.name,
    })),
    { id: "add", src: "./BUTTON_ADD.svg", alt: "Add Company", isAdd: true },
  ];

  
  useEffect(() => {
    if (order.length > 0) {
      const topId = order[0];
      const topIcon = icons.find(icon => icon.id === topId);
      if (topIcon && topIcon.color && !topIcon.isAdd) {
        document.body.style.backgroundColor = topIcon.color;
      } else {
        document.body.style.backgroundColor = ""; 
      }
    }
  }, [order, icons]);

  const toggleMenu = () => setOpen(o => !o);

  const handleClick = id => {
    if (id === "add") {
      setIsModalOpen(true);
      setOpen(false);
      return;
    }
    
    if (order[0] === id) {
      toggleMenu();
      return;
    }
    
    selectCompany(id);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newCompany = {
      id: Date.now().toString(),
      name: newName,
      color: newColor,
      profilePic: newProfilePic,
    };
    
    addCompany(newCompany);
    
    setNewName("");
    setNewColor("#000000");
    setNewProfilePic(null);
    setIsModalOpen(false);
    setOpen(false);
  };

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
    <div className="company__menu" ref={menuRef} style={{ "--open": open ? 1 : 0 }}>
      {icons.map(icon => {
        
        const pos = icon.isAdd ? order.length : order.indexOf(icon.id);
        const transform = pos > 0 ? (open ? `translateX(-${pos * 4}rem)` : "translateX(0)") : undefined;
        
        const zIndex = order.length + 1 - pos;
        return (
          <button
            key={icon.id}
            className={
              `company__button ${pos === 0 ? 'trigger' : 'item'}` +
              (open ? ' visible' : '') +
              (icon.isAdd ? ' add' : '')
            }
            style={{
              "--i": pos,
              zIndex,
              ...(transform && { transform }),
            }}
            onClick={() => handleClick(icon.id)}
          >
            {icon.src ? <img src={icon.src} alt={icon.alt} /> : icon.name}
          </button>
        );
      })}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Add Company</h2>
        <form className="company-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
          </label>
          <label>
            Color:
            <input
              type="color"
              value={newColor}
              onChange={e => setNewColor(e.target.value)}
            />
          </label>
          <label>
            Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewProfilePic(e.target.files[0])}
            />
          </label>
          <button type="submit">Create</button>
        </form>
      </Modal>
    </div>
  );
}
