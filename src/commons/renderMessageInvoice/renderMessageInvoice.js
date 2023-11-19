import React from 'react';

export const renderModalMessage = (modalMessage, userName) => {
  switch (modalMessage) {
    case 'OVERDUE_INVOICE':
      return (
        <>
          <h2>Aviso Importante sobre Fatura Vencida</h2>
          <p>
            Prezado(a) {userName},
          </p>
          <p>
            Estamos entrando em contato para informar que identificamos uma fatura em aberto em sua conta, a qual está atualmente vencida.
          </p>
          <p>
            O não pagamento pode resultar no bloqueio temporário de sua conta, o que impactará o acesso aos nossos serviços.
          </p>
          <p>
            Por favor, tome as medidas necessárias para regularizar a situação o mais rápido possível, garantindo assim a continuidade do acesso à sua conta.
          </p>
          <p>
            Se você já efetuou o pagamento, por favor, desconsidere esta mensagem, pois pode ter ocorrido um atraso na atualização do sistema.
          </p>
        </>
      );
    default:
      return null;
  }
};
