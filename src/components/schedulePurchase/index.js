import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useHistory } from 'react-router-dom';
import './style.css';

Modal.setAppElement('#root');

const SchedulePurchase = ({ onSchedule }) => {
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const now = new Date();
    if (now.getHours() >= 4) {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(4, 0, 0, 0);
      setSelectedDate(tomorrow);
    }
  }, []);

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(4, 0, 0, 0);
    return date >= today;
  };

  const handleSchedule = () => {
    if (isFutureDate(selectedDate)) {
      setIsModalOpen(false);
      onSchedule(selectedDate);
    } else {
      // Trate o caso de uma data inválida, se necessário.
    }
  };

  const onClose = () => {
    history.push('/home');
  };

  return (
    <Modal
      isOpen={isModalOpen}
      className="purchase-modal-content"
      overlayClassName="purchase-modal-glass"
      shouldCloseOnOverlayClick={false}
    >
      <div className="schedule-modal">
        <h2>Escolha uma data para realizar o pedido:</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date(new Date().setHours(4, 0, 0, 0))}
          tileDisabled={({ date }) => !isFutureDate(date)}
          className="calendar"
        />

        <div className="button-container">
          <button className="schedule-button" onClick={handleSchedule}>Agendar</button>
          <button className="close-button" onClick={onClose}>Voltar</button>
        </div>
      </div>
    </Modal>
  );
};

export default SchedulePurchase;
