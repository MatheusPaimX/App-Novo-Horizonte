import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.105:8080', // Altere para a URL da sua API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;