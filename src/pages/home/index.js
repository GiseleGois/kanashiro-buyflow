import React, { useState } from 'react';
import './style.css';
import { auth } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faStore, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import GenericModal from '../../commons/modal/genericModal';

function Home() {
  const history = useHistory();
  const [selectedLocal, setSelectedLocal] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleLogout = () => {
    auth.signOut().then(() => {
      history.push('/');
    });
  };

  const handleChooseLocal = (local) => {
    setSelectedLocal(local);
    handleNewOrder(local);
  };

  const handleNewOrder = (local) => {
    if (local) {
      history.push(`/schedule-purchase/${local}`);
    } else {
      setModalMessage('Por favor, escolha um local antes de prosseguir.');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleToPageHistory = () => {
    history.push('/history');
  };


  return (
    <div className="home-container">
      <header className="header">
        <nav className="navbar">
          <p className="logo"></p>
          <ul className="menu">
            <li className="menu-item" onClick={handleToPageHistory}>Histórico de pedidos</li>
          </ul>
          <button onClick={handleLogout} className="logout-button">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </nav>

        <div id="home" className="header-content">
          <h1>Bem vindo(a)</h1>
        </div>
      </header>

      <div className="btn-container">
        <h2>Para qual local deseja efetuar o pedido:</h2>
        <div className="button">
          <div className="button-icon">
            <FontAwesomeIcon icon={faMapMarkerAlt} onClick={() => handleChooseLocal('Pontinho')} />
          </div>
          <p>Pontinho</p>
        </div>

        <div className="button">
          <div className="button-icon">
            <FontAwesomeIcon icon={faStore} onClick={() => handleChooseLocal('Feira')} />
          </div>
          <p>Feira</p>
        </div>
      </div>

      {showModal && (
        <GenericModal
          message={modalMessage}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Home;
