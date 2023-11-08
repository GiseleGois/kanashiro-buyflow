import React, { useState, useEffect } from 'react';
import './style.css';
import SchedulePurchase from '../../components/schedulePurchase';
import Loading from '../../components/loading';
import { listProducts, listProductsWithDiscount, sendOrder, userById } from '../../services';
import ConfirmModal from '../../commons/modal/confirmModal';
import GenericModal from '../../commons/modal/genericModal';
import { useHistory } from 'react-router-dom';

function ShoppingCart() {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [local, setLocal] = useState();
  const [userHasDiscount, setUserHasDiscount] = useState();

  const [selectedDate, setSelectedDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await userById();
        setUserHasDiscount(user[0].discount === true);
        if (user[0].discount === true) {
          const productsWithDiscount = await listProductsWithDiscount(user[0].discount_lvl);

          setProducts(productsWithDiscount);
        } else {
          const allProducts = await listProducts();
          setProducts(allProducts);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user discount or fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSchedulePurchase = (date, local) => {
    setLocal(local);
    setSelectedDate(date);
    setIsScheduleModalOpen(false);
  };

  const handleConfirmPurchase = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmModal = async () => {
    setIsConfirmModalOpen(false);
    await confirmPurchase();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    history.push('/home');
  };

  const calculateTotal = () => {
    let total = 0;
    products.forEach((product) => {
      const quantity = productQuantities[product.id] || 0;
      total += product.amount * quantity;
    });
    return total;
  };

  function removePontosEVirgulas(valor) {
    return valor.replace(/[.,]/g, '').trim();
  };

  const confirmPurchase = async () => {
    try {
      const total = calculateTotal();

      const selectedItems = products
        .filter((product) => productQuantities[product.id] > 0)
        .map((product) => ({
          product: product.name,
          amount: product.amount,
          total: product.amount * productQuantities[product.id],
          quantity: parseInt(productQuantities[product.id]),
          productId: product.id,
          type: product.type,
        }));

      if (selectedItems.length === 0) {
        setError('Por favor, selecione pelo menos um produto antes de finalizar a compra.');
      } else {
        const checkout = await sendOrder(selectedItems, total, local, selectedDate);
        if (checkout) {
          setSuccessMessage('Pedido feito com sucesso!');
          setShowSuccessModal(true);
        } else {
          setError('Pedido não efetuado');
        }
      }
    } catch (error) {
      setError(`Erro ao finalizar a compra: ${error.message}`);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(Object.keys(productQuantities).length === 0 || isLoading);
  }, [productQuantities, isLoading]);

  return (
    <div className="schedule-container">
      {isLoading && <Loading />}
      {!isLoading && isScheduleModalOpen && (
        <SchedulePurchase onSchedule={handleSchedulePurchase} onClose={() => setIsScheduleModalOpen(false)} />
      )}
      {!isLoading && !isScheduleModalOpen && (
        <div className="main-content">
          {error && (
            <GenericModal
              message={error}
              onClose={() => setError('')}
            />
          )}
          <table>
            <thead>
              <tr>
                <th>Nome do Produto</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <span className="product-name">{product.name}</span>
                    <p className="product-subtitle">Valor unitário: R$ {product.amount.toFixed(2)}</p>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={productQuantities[product.id] || ''}
                      onChange={(e) => {
                        const novoValor = removePontosEVirgulas(e.target.value);
                        const newQuantities = { ...productQuantities };
                        newQuantities[product.id] = novoValor;
                        setProductQuantities(newQuantities);
                      }}
                      className="quantity-input"
                      min="0"
                      step="1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="total-container">
            <div className="total-box">
              <p>Total: R$ {calculateTotal()}</p>
              <button
                onClick={handleConfirmPurchase}
                className="confirm-button"
                disabled={isButtonDisabled}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          message="Tem certeza que deseja finalizar a compra?"
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmModal}
        />
      )}

      {showSuccessModal && (
        <GenericModal
          message={successMessage}
          onClose={handleSuccessModalClose}
        />
      )}

    </div>
  );
}

export default ShoppingCart;
