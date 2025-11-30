// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Ruta de login que tu frontend llama
router.post('/login', authController.login);

module.exports = router;