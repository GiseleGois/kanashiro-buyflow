import React, { useState, useEffect } from 'react';
import './style.css';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getOrders } from '../../services';
import { formattedOrders, sortedOrders } from '../../commons/helpers';
import { WEEK_DAYS } from '../../commons/enums';

function History() {
  const history = useHistory();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetOrders();
  }, []);

  const handleGetOrders = async () => {
    try {
      const allOrders = await getOrders();
      const formatted = formattedOrders(allOrders, WEEK_DAYS);
      const sorted = sortedOrders(formatted);
      setOrders(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar os pedidos:', error);
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    history.push('/home');
  };

  return (
    <div className="history-container">
      <header className="history-header">
        <nav className="history-navbar">
          <button onClick={handleBackToHome} className="history-out-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </nav>
      </header>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-item">
              <p>{order.formattedDate}</p>
              <div>
                <ul>
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.product} x{item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <p>Total: R$ {order.total.toFixed(2).replace('.', ',')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
