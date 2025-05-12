import "../styles/Modal.css";
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
        <img src="./BUTTON_CROSS.svg" alt="BUTTON_CROSS" />
        </button>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
}
