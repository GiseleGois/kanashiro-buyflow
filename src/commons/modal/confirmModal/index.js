import React from 'react';
import './style.css';

const ConfirmModal = ({ message, onClose, showSuccessModal, successMessage, onConfirm }) => {
  return (
    <div className={`confirm-modal ${showSuccessModal ? 'success-modal' : ''}`}>
      <div className="confirm-modal-content">
        {showSuccessModal ? (
          <p>{successMessage}</p>
        ) : (
          <div>
            <p>{message}</p>
            <button onClick={onConfirm} className="confirm-modal-confirm-button">Confirmar</button>
          </div>
        )}
        <button onClick={onClose} className="confirm-modal-close-button">Cancelar</button>
      </div>
    </div>
  );
};

export default ConfirmModal;
