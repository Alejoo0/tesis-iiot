// src/api/axiosInstance.js
import axios from 'axios';

// Define la URL base de tu backend de Express.js
// En producción, esto debería ser una variable de entorno (.env)
const API_BASE_URL = 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;