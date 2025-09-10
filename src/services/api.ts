import { api } from '../lib/api';

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', userData),
  
  verifyToken: () => api.get('/auth/verify'),
  
  logout: () => api.post('/auth/logout'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (category: string) => api.get(`/products?category=${encodeURIComponent(category)}`),
  create: (product: any) => api.post('/products', product),
  update: (id: string, product: any) => api.put(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
  search: (query: string) => api.get(`/products/search?q=${encodeURIComponent(query)}`),
  getSimilar: (category: string, excludeId: string) => 
    api.get(`/products?category=${encodeURIComponent(category)}&exclude=${excludeId}&limit=8`),
};

export const ordersAPI = {
  create: (orderData: { items: any[]; deliveryAddress: string }) =>
    api.post('/orders', orderData),
  
  getAll: () => api.get('/orders'),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (category: any) => api.post('/categories', category),
};