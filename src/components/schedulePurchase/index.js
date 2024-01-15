import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const [local, setLocal] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [newLocationModalOpen, setNewLocationModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [duplicatedModalOpen, setDuplicatedModalOpen] = useState(false);
  const [excededTimeModalOpen, setExcededTimeModalOpen] = useState(false);

  const now = new Date();
  const today = new Date(now);
  today.setHours(4, 0, 0, 0);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user[0].uuid) {
      setUserId(user[0].uuid);
    }
  }, []);

  useEffect(() => {
    const fourAM = new Date(now);
    fourAM.setHours(4, 0, 0, 0);

    if (now < fourAM) {
      setMaxDate(today);
    } else {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 2);
      setMaxDate(nextDay);
    }

    setSelectedDate(today);
    setMinDate(today);
  }, []);

  const isFutureDate = (date) => {
    return date >= today;
  };

  const onClose = () => {
    history.push('/home');
  };

  const isPast4AMOnDate = (date) => {
    const fourAMOnDate = new Date(date);
    fourAMOnDate.setHours(4, 0, 0, 0);
    return now > fourAMOnDate;
  };

  const handleSchedule = async () => {
    if (selectedDate && isFutureDate(selectedDate)) {
      if (isPast4AMOnDate(selectedDate)) {
        setExcededTimeModalOpen(true);
      } else {
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
    }
  }

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
          <h2>Digite um nome para o seu pedido e escolha a data em que deseja que ele seja produzido.</h2>
          <input
            type="text"
            placeholder="ex: cecap"
            className="purchase-input"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />

          <DatePicker
            selected={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
          />

          <div className="button-container">
            <button className="schedule-button" onClick={handleSchedule}>
              Agendar
            </button>
            <button className="close-button" onClick={onClose}>
              Voltar
            </button>
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

      <Modal
        isOpen={excededTimeModalOpen}
        className="purchase-modal-content"
        overlayClassName="purchase-modal-glass"
        shouldCloseOnOverlayClick={false}
      >
        <div className="schedule-modal">
          <h2>Infelizmente o tempo limite para efetuar pedidos nessa data já expirou, selecione outro dia..</h2>
          <div className="button-container">
            <button className="close-button" onClick={() => setExcededTimeModalOpen(false)}>Fechar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SchedulePurchase;
