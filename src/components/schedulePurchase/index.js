import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useHistory } from 'react-router-dom';
import './style.css';
import { checkUserPurchases } from '../../commons/checkPurchases';

Modal.setAppElement('#root');

const SchedulePurchase = ({ onSchedule }) => {
  const history = useHistory();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [userId, setUserId] = useState('');
  const [local, setLocal] = useState();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [newLocationModalOpen, setNewLocationModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  useEffect(() => {
    const location = window.location.pathname;
    const localPart = location.substring('/schedule-purchase/'.length);
    setLocal(localPart);
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user[0].uuid) {
      setUserId(user[0].uuid);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    if (now.getHours() >= 4) {
      tomorrow.setDate(now.getDate() + 1);
    }
    tomorrow.setHours(4, 0, 0, 0);
    setSelectedDate(tomorrow);
  }, []);

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(4, 0, 0, 0);
    return date >= today;
  };

  const handleSchedule = async () => {
    if (isFutureDate(selectedDate)) {
      const userHasPurchase = await checkUserPurchases(selectedDate, local, userId);

      if (userHasPurchase) {
        setConfirmationModalOpen(true);
      } else {
        setIsModalOpen(false);
        const locationToSchedule = newLocation || local;
        onSchedule(selectedDate, locationToSchedule);
      }
    }
  };


  const onClose = () => {
    history.push('/home');
  };

  const confirmNewPurchase = () => {
    setConfirmationModalOpen(false);
    setNewLocationModalOpen(true);
  };

  const confirmNewLocation = () => {
    if (newLocation.trim() !== '' && newLocation.toLowerCase() !== local.toLowerCase()) {
      setNewLocationModalOpen(false);
      setIsModalOpen(false);
      onSchedule(selectedDate, newLocation);
    } else {
      // Nome do local está vazio, exibir o modal de erro
      setErrorModalOpen(true);
    }
  };


  return (
    <div>
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
            minDate={new Date(new Date().setHours(3, 59, 59, 59))}
            tileDisabled={({ date }) => !isFutureDate(date)}
            className="calendar"
          />

          <div className="button-container">
            <button className="schedule-button" onClick={handleSchedule}>Agendar</button>
            <button className="close-button" onClick={onClose}>Voltar</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmationModalOpen}
        className="purchase-modal-content"
        overlayClassName="purchase-modal-glass"
        shouldCloseOnOverlayClick={false}
      >
        <div className="schedule-modal">
          <h2>Você já possui um pedido agendado para esta data e local. Deseja fazer um novo agendamento?</h2>
          <div className="button-container">
            <button className="schedule-button" onClick={confirmNewPurchase}>Sim</button>
            <button className="close-button" onClick={() => setConfirmationModalOpen(false)}>Não</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={newLocationModalOpen}
        className="purchase-modal-content"
        overlayClassName="purchase-modal-glass"
        shouldCloseOnOverlayClick={false}
      >
        <div className="schedule-modal">
          <h2>Insira o nome do novo local:</h2>
          <input
            type="text"
            placeholder='ex: cecap'
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <div className="button-container">
            <button className="schedule-button" onClick={confirmNewLocation}>Agendar</button>
            <button className="close-button" onClick={() => setNewLocationModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={errorModalOpen}
        className="purchase-modal-content"
        overlayClassName="purchase-modal-glass"
        shouldCloseOnOverlayClick={false}
      >
        <div className="schedule-modal">
          <h2>Erro: O nome do local não pode estar em branco ou ser igual a: {local}</h2>
          <div className="button-container">
            <button className="close-button" onClick={() => setErrorModalOpen(false)}>Fechar</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default SchedulePurchase;
