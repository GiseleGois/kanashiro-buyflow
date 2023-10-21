import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';
import Modal from '../../commons/modal/genericModal';
import enums from '../../commons/enums';
import { getAuthorizationToLogin } from '../../services';

function Login() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formLogin = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    try {
      const userLogin = await getAuthorizationToLogin(formLogin);
      if (userLogin[0].authorizer === true) {
        sessionStorage.setItem('user', JSON.stringify(userLogin));
        setLoading(true);
        history.push('/home');
      }
      setIsModalOpen(true);
      setModalMessage(enums.LOGIN_RESPONSE.ACCESS_DENIED);
    } catch (error) {
      // Trate erros de autenticação aqui
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    history.push('/register');
  };

  return (
    <div className="blur-bg">
      <div className="login-container">
        <div className="login-card">
          <h2 className="title-field">Kanashiro Pasteis</h2>
          <form onSubmit={handleLogin}>
            {isModalOpen && (
              <Modal message={modalMessage} onClose={() => setIsModalOpen(false)} />
            )}
            <input type="email" id="email" name="email" className="input-field" placeholder='Digite seu email' />
            <input type="password" id="password" name="password" className="input-field" placeholder='Digite sua senha' />
            <div className="button-container">
              <div className="button-wrapper">
                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? 'Carregando...' : 'Entrar'}
                </button>
                <button type="button" className="btn-register" onClick={handleRegister}>
                  Cadastrar
                </button>
              </div>
              {loading && <div className="progress"></div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
