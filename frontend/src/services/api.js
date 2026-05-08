import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('packsmart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('packsmart_token');
      localStorage.removeItem('packsmart_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const signup = (username, password) =>
  api.post('/auth/signup', { username, password });

export const login = (username, password) =>
  api.post('/auth/login', { username, password });

// ── Items ──
export const getItems = () => api.get('/items');

export const addItem = (name, weight, importance) =>
  api.post('/items', { name, weight, importance });

export const updateItem = (id, data) => api.put(`/items/${id}`, data);

export const deleteItem = (id) => api.delete(`/items/${id}`);

// ── Bag Capacity ──
export const updateBagCapacity = (capacity) =>
  api.put('/items/bag-capacity/update', { capacity });

// ── Optimize ──
export const runOptimize = () => api.post('/optimize');

export default api;
