import React, { useState, useEffect } from 'react';
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
  const [userName, setUserName] = useState('');
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user'));

        if (user && user[0].name) {
          setUserName(user[0].name);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userName]);

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
          <h1>Bem vindo(a), {userName}</h1>
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
          message={modalContent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default Home;
