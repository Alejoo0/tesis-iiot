const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
// const { protect } = require('../middlewares/authMiddleware'); // Descomentar si usas JWT

// GET http://localhost:3000/api/data/telemetry/prensa01
router.get('/telemetry/:machineId', dataController.getMachineData);

module.exports = router;