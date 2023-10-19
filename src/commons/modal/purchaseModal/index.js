import React from 'react';
import './style.css';

const ModalPurchase = ({ message, onClose, showSuccessModal, successMessage }) => {
  return (
    <div className={`purchase-modal ${showSuccessModal ? 'success-modal' : ''}`}>
      <div className="purchase-modal-content">
        {showSuccessModal ? (
          <p>{successMessage}</p>
        ) : (
          <p>{message}</p>
        )}
        <button onClick={onClose} className="purchase-modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalPurchase;
