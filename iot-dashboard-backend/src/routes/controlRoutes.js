const express = require('express');
const router = express.Router();
const controlController = require('../controllers/controlController');
const { protect } = require('../middlewares/authMiddleware'); // Importante protegerlo

// POST /api/control/send (Enviar orden)
router.post('/send', protect, controlController.sendCommand);

// GET /api/control/history (Leer historial) <--- ¡NUEVA RUTA!
router.get('/history', protect, controlController.getAuditHistory);

module.exports = router;