import axios from "axios";
import config from "../config";
import { auth } from '../firebase';

const {
  url
} = config;

const listProducts = async () => {
  try {
    const { data } = await axios.get(`${url}/fetch-product-type`);
    const getProducts = data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d');
    return getProducts;
  } catch (error) {
    throw new Error(`Falha ao obter todos os produtos: ${error}`);
  }
};

const listProductsWithDiscount = async () => {
  try {
    const { data } = await axios.get(`${url}/discount`);
    const getProducts = data.filter(product => product.type !== 'papel' && product.type !== 'entrega-p' && product.type !== 'entrega-d');
    return getProducts;
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

const getOrders = async () => {
  try {
    const { data } = await axios.get(`${url}/orders-by-id/${auth.currentUser.uid}`);
    return data;
  } catch (error) {
    throw new Error(`Falha ao obter os pedidos: ${error}`);
  }
};

export {
  listProducts,
  listProductsWithDiscount,
  createNewUser,
  userById,
  sendOrder,
  getOrders,
};