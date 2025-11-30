// src/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/jwt');


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Buscar usuario en la base de datos
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      // 401 Unauthorized
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    

    // 2. Comparar la contraseña (hash almacenado vs. texto plano recibido)
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar el Token JWT
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, allowedDevice: user.allowed_device },
        jwtSecret, // <--- Usamos el secreto de config/jwt.js
        { expiresIn: jwtExpiration } // <--- Usamos la expiración de config/jwt.js
    );

    // 4. Enviar el token a React
    res.json({ token });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};