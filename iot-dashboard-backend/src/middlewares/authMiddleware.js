// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

/**
 * Middleware para verificar la validez del JWT en las peticiones.
 */
exports.protect = (req, res, next) => {
  // 1. Obtener el token del encabezado (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 401: No autorizado (token faltante o formato incorrecto)
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  // Extraer solo la parte del token
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verificar y decodificar el token usando el secreto
    const decoded = jwt.verify(token, SECRET);

    // 3. Adjuntar la información del usuario al objeto de la solicitud (req)
    // Esto es útil para saber quién hace la petición (ID, rol, etc.)
    req.user = decoded; 

    // 4. Continuar al siguiente middleware o controlador
    next();

  } catch (error) {
    // Si la verificación falla (token expirado, inválido, corrupto)
    console.error('Error de verificación de token:', error.message);
    // 403: Prohibido (token es inválido)
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};