import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';
import Modal from '../../commons/modal/genericModal';
import {
  formatCpf,
  formatPhone,
  handleValidPassword,
  checkEmptyFields,
  removeSpecialCharacters,
} from '../../commons/validateInput';
import { createNewUser } from '../../services';

function Register() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { firstName, lastName, cpf, email, phone, password, confirmPassword } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'cpf' ? formatCpf(value) : name === 'phone' ? formatPhone(value) : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    formData.phone = removeSpecialCharacters(formData.phone);
    setLoading(true);

    if (!checkEmptyFields(formData, setModalMessage)) {
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    const isValidPassword = handleValidPassword(formData, setModalMessage, setIsModalOpen);
    if (!isValidPassword) {
      setLoading(false);
      return;
    }

    try {
      const createUser = await createNewUser(formData);
      if (createUser) {
        setIsSuccessModalOpen(true);
        setModalMessage('Usuário criado com sucesso.');

        setTimeout(() => {
          setIsSuccessModalOpen(false);
          history.push('/');
        }, 3000);
      }
    } catch (error) {
      setIsModalOpen(true);
      setModalMessage(`${error.message} Por favor, tente novamente.`);
    }
    finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = () => {
    history.push('/');
  };

  return (
    <div className="blur-background">
      <div className="container">
        <div className="blur-container">
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="firstName"
              className="register-input-field"
              placeholder="Nome"
              value={firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              className="register-input-field"
              placeholder="Sobrenome"
              value={lastName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="cpf"
              className="register-input-field"
              placeholder="CPF"
              maxLength={14}
              value={cpf}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              className="register-input-field"
              placeholder="Email"
              value={email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              className="register-input-field"
              placeholder="Telefone"
              maxLength={15}
              value={phone}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              className={`register-input-field ${!handleValidPassword(password, confirmPassword) ? 'input-error' : ''}`}
              placeholder="Senha"
              value={password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="confirmPassword"
              className={`register-input-field ${!handleValidPassword(password, confirmPassword) ? 'input-error' : ''}`}
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={handleInputChange}
            />
            {!handleValidPassword && <p className="error-message">As senhas não coincidem.</p>}
            <div className="register-button-container">
              <div className="register-button-wrapper">
                <button type="button" className="button-register" onClick={handleRegister}>
                  Confirmar
                </button>
                <button type="button" className="back-button" onClick={handleCancelRegistration}>
                  Cancelar
                </button>
              </div>
              {isModalOpen && (
                <Modal message={modalMessage} onClose={() => setIsModalOpen(false)} />
              )}
              {isSuccessModalOpen && (
                <Modal showSuccessModal successMessage={modalMessage} onClose={() => setIsSuccessModalOpen(false)} />
              )}
              {loading && <div className="progress"></div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
