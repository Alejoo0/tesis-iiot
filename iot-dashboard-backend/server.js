// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./src/routes/authRoutes');
const dataRoutes = require('./src/routes/dataRoutes'); // ¡Nuevo!
const controlRoutes = require('./src/routes/controlRoutes');
// ...


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Rutas
app.use('/api/auth', authRoutes); 
app.use('/api/data', dataRoutes);
app.use('/api/control', controlRoutes); // ¡Nuevo! Define el prefijo /api/data

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Backend IIoT en funcionamiento');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express.js corriendo en http://localhost:${PORT}`);
});