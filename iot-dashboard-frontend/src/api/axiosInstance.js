// src/api/axiosInstance.js
import axios from 'axios';

// Define la URL base de tu backend de Express.js
// En producción, esto debería ser una variable de entorno (.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;