import React from 'react';
import './style.css';

const Modal = ({ message, onClose, showSuccessModal, successMessage }) => {
  return (
    <div className={`modal ${showSuccessModal ? 'success-modal' : ''}`}>
      <div className="modal-content">
        {showSuccessModal ? (
          <p>{successMessage}</p>
        ) : (
          <p>{message}</p>
        )}
        <button onClick={onClose} className="modal-close-button">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Modal;
