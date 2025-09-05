import { api } from '../lib/api';

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', userData),
  
  verifyToken: () => api.get('/auth/verify'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (product: any) => api.post('/products', product),
  search: (query: string) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
};

export const ordersAPI = {
  create: (orderData: { items: any[]; deliveryAddress: string }) =>
    api.post('/orders', orderData),
  
  getAll: () => api.get('/orders'),
};