import axios from 'axios';
import { getToken } from '../utils/storage';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export const productsAPI = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getProductsByCategory: async (categoryId: string) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },
  searchProducts: async (query: string) => {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  },
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export const ordersAPI = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};