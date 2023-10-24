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
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [newLocation, setNewLocation] = useState('');
  const [userId, setUserId] = useState('');
  const [local, setLocal] = useState();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [newLocationModalOpen, setNewLocationModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [duplicatedModalOpen, setDuplicatedModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user[0].uuid) {
      setUserId(user[0].uuid);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(4, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 1);
    maxDate.setHours(3, 59, 59, 59);
    setSelectedDate(null);
    setMinDate(today);
    setMaxDate(maxDate);
  }, []);

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(4, 0, 0, 0);
    return date >= today;
  };
  const isWithin24Hours = (date) => {
    const now = new Date();
    const next24Hours = new Date(now);
    next24Hours.setHours(4, 0, 0, 0);
    next24Hours.setDate(now.getDate() + 1);
    const threeFiftyNineAM = new Date(now);
    threeFiftyNineAM.setHours(3, 59, 59, 999);
    return date >= next24Hours || date <= threeFiftyNineAM;
  };

  const onClose = () => {
    history.push('/home');
  };

  const handleSchedule = async () => {
    if (selectedDate && isFutureDate(selectedDate) && !isWithin24Hours(selectedDate)) {
      if (!local || local.trim() === '') {
        setErrorModalOpen(true);
      } else {
        const userHasPurchase = await checkUserPurchases(selectedDate, local, userId);
        if (userHasPurchase) {
          setConfirmationModalOpen(true);
        } else {
          setIsModalOpen(false);
          const locationToSchedule = newLocation || local;
          onSchedule(selectedDate, locationToSchedule);
        }
      }
    }
  };

  const confirmNewPurchase = () => {
    setConfirmationModalOpen(false);
    setNewLocationModalOpen(true);
  };

  const confirmNewLocation = () => {
    if (newLocation && newLocation.trim() !== '' && newLocation.toLowerCase() !== local.toLowerCase()) {
      setNewLocationModalOpen(false);
      setIsModalOpen(false);
      onSchedule(selectedDate, newLocation);
    } else {
      setDuplicatedModalOpen(true);
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
          <h2>Insira um nome para seu pedido e escolha a data para ele ser produzido</h2>
          <input
            type="text"
            placeholder='ex: cecap'
            className="purchase-input"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            tileDisabled={({ date }) => !isFutureDate(date) || isWithin24Hours(date)}
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
            className="purchase-input"
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
        isOpen={duplicatedModalOpen}
        className="purchase-modal-content"
        overlayClassName="purchase-modal-glass"
        shouldCloseOnOverlayClick={false}
      >
        <div className="schedule-modal">
          <h2>Erro: Já existe um pedido nessa mesma data com o mesmo nome, por favor insira um nome diferente.</h2>
          <div className="button-container">
            <button className="close-button" onClick={() => setDuplicatedModalOpen(false)}>Fechar</button>
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
          <h2>Erro: O nome do local não pode estar em branco</h2>
          <div className="button-container">
            <button className="close-button" onClick={() => setErrorModalOpen(false)}>Fechar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SchedulePurchase;
