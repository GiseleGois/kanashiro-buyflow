import axios from "axios";
import config from "../config";
import { auth } from '../firebase';

const {
  url
} = config;

const listProducts = async () => {
  try {
    const { data } = await axios.get(`${url}/fetch-product-type`);
    const checkUser = await userById(auth.currentUser.uid);
    if (checkUser[0].uuid === 'bSLNXJBZ6bNvDoF3hvSx4wX9ONa2') {
      data.map(product => {
        if (product.name === 'Coxinha/Catupiry') {
          product.amount = 4;
        }
      });
    }

    if (checkUser) {
      if (checkUser[0].privileges === true) {
        return data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d');
      } else {
        return data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d' && product.name !== 'Coxinha/Catupiry');
      }
    }

    return [];
  } catch (error) {
    throw new Error(`Falha ao obter todos os produtos: ${error}`);
  }
};

const listProductsWithDiscount = async (discountLvl) => {
  try {
    const { data } = await axios.get(`${url}/discount/${discountLvl}`);
    const checkUser = await userById(auth.currentUser.uid);

    if (checkUser) {
      if (checkUser[0].privileges === true) {
        return data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d');
      } else {
        return data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d' && product.name !== 'Coxinha/Catupiry');
      }
    }

    return [];
  } catch (error) {
    throw new Error(`Falha ao obter todos os produtos com desconto: ${error}`);
  }
};

const createNewUser = async (payload) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      payload.email.toLowerCase(),
      payload.password
    );

    const { user } = userCredential;
    if (!user) {
      throw new Error('Usuário não criado corretamente.');
    }

    const { data } = await axios.post(`${url}/register`, {
      email: payload.email.toLowerCase(),
      cpf: payload.cpf,
      name: payload.firstName,
      lastname: payload.lastName,
      phone: payload.phone,
      uuid: user.uid,
    });

    return data;
  } catch (error) {
    throw new Error(`Falha ao registrar um novo usuário: ${error.message}`);
  }
};

const getAuthorizationToLogin = async (payload) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(payload.email, payload.password);

    const { user } = userCredential;
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const { data } = await axios.get(`${url}/user-by-id/${auth.currentUser.uid}`);
    return data;
  } catch (error) {
    return {
      data: error.response.data,
      message: error.message,
      code: error.response.status
    }
  }
};


const userById = async () => {
  try {
    const { data } = await axios.get(`${url}/user-by-id/${auth.currentUser.uid}`);
    return data;
  } catch (error) {
    throw new Error(`Falha ao obter usuario: ${error}`);
  }
};

const sendOrder = async (selectedItems, total, location, selectedDate) => {
  try {

    const verifyUser = await userById();
    const payload = {
      items: selectedItems,
      username: auth.currentUser.email,
      userFullName: `${verifyUser[0].name} ${location}`,
      total: total,
      local: location,
      userId: auth.currentUser.uid,
      scheduled: selectedDate,
    };

    const { data } = await axios.post(`${url}/order`, payload);
    return data;
  } catch (error) {
    throw new Error('Falha ao criar pedido');
  }
};

const getOrders = async (uuid) => {
  try {
    const userUUID = uuid || auth.currentUser.uid;
    const { data } = await axios.get(`${url}/orders-by-id/${userUUID}`);
    return data;
  } catch (error) {
    throw new Error(`Falha ao obter os pedidos: ${error}`);
  }
};

const showOverdueInvoice = async (uuid) => {
  try {
    const userUUID = uuid || auth.currentUser.uid;
    const { data } = await axios.get(`${url}/invoices`, {
      params: { userId: userUUID },
    });

    return data;
  } catch (error) {
    throw new Error(`Falha ao obter as faturas: ${error}`);
  }
}

export {
  listProducts,
  listProductsWithDiscount,
  getAuthorizationToLogin,
  createNewUser,
  userById,
  sendOrder,
  getOrders,
  showOverdueInvoice,
};