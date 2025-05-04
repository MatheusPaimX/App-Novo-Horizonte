import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/alunos', // Altere para a URL da sua API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;