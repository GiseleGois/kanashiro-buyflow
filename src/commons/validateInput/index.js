const checkEmptyFields = (formData, setModalMessage) => {
  for (const key in formData) {
    if (formData[key].trim() === '') {
      setModalMessage(`O campo ${key} não pode estar vazio.`);
      return false;
    }
  }
  return true;
};

const handleValidPassword = (formData, setModalMessage, setIsModalOpen) => {
  if (formData.password !== formData.confirmPassword) {
    setModalMessage('As senhas não coincidem.');
    setIsModalOpen(true);
    return false;
  }
  return true;
};

const formatCpf = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{2})$/, '$1-$2');
  return cpf;
};

const formatPhone = (phone) => {
  phone = phone.replace(/\D/g, '');
  phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
  phone = phone.replace(/(\d{1})(\d{4})(\d{4})$/, ' $1 $2-$3');
  return phone;
};

const removeSpecialCharacters = (phone) => {
  return phone.replace(/\D/g, '');
};

module.exports = {
  checkEmptyFields,
  handleValidPassword,
  formatCpf,
  formatPhone,
  removeSpecialCharacters,
};
