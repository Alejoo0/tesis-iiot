// src/config/jwt.js
require('dotenv').config();

// 1. JWT_SECRET: La clave secreta para firmar y verificar el token.
// Es crucial que esta variable se lea desde tu archivo .env.
const jwtSecret = process.env.JWT_SECRET;

// 2. JWT_EXPIRATION: El tiempo de vida del token. 
// Esto es importante para obligar al usuario a iniciar sesión periódicamente.
// Formato común: '1d' (1 día), '7d' (7 días), '1h' (1 hora).
const jwtExpiration = '1d'; 

// 3. Opciones de Algoritmo (opcional, pero buena práctica)
// Por defecto, jsonwebtoken usa HS256, pero es bueno ser explícito.
const jwtAlgorithm = 'HS256';

module.exports = {
  jwtSecret,
  jwtExpiration,
  jwtAlgorithm,
};