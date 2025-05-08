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
  const [previewUrl, setPreviewUrl] = useState(null);
  const menuRef = useRef(null);

  const icons = [
    ...companies.map((c) => ({
      id: c.id,
      src: c.profilePicUrl || undefined,
      alt: c.name,
      color: c.color,
      isAdd: false,
      name: c.name,
    })),
    { id: "add", src: "./BUTTON_ADD.svg", alt: "Add Company", isAdd: true },
  ];

  const toggleMenu = () => setOpen((o) => !o);

  const handleClick = (id) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", newName);
    fd.append("color", newColor);
    if (newProfilePic) fd.append("profilePic", newProfilePic);

    await addCompany(fd);
    setNewName("");
    setNewColor("#000000");
    setNewProfilePic(null);
    setPreviewUrl(null);
    setIsModalOpen(false);
    setOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setNewProfilePic(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="company__menu" ref={menuRef} style={{ "--open": open ? 1 : 0 }}>
      {icons.map((icon) => {
        const pos = icon.isAdd ? order.length : order.indexOf(icon.id);
        const transform = pos > 0 ? (open ? `translateX(-${pos * 4}rem)` : "translateX(0)") : undefined;
        const zIndex = order.length + 1 - pos;
        return (
          <button
            key={icon.id}
            className={`company__button ${pos === 0 ? "trigger" : "item"}` + (open ? " visible" : "") + (icon.isAdd ? " add" : "")}
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
          <div className="form__fields">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required placeholder="Name" />
            <label
              className={`file__circle ${previewUrl ? "has-preview" : ""}`}
              style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : "none" }}
            >
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {!previewUrl && <img className="placeholder-icon" src="/BUTTON_ADD_SMALL.svg" alt="Add Icon" />}
              {previewUrl && <img className="edit__icon" src="/EDIT_ICON.svg" alt="Edit Icon" />}
            </label>
            <div
              className="color__circle"
              style={{ backgroundColor: newColor }}
              onClick={() => document.getElementById("hidden-color-input").click()}
            />
            <input
              id="hidden-color-input"
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              style={{ display: "none" }}
            />{" "}
          </div>
          <button type="submit">Create</button>
        </form>
      </Modal>
    </div>
  );
}
