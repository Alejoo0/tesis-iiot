const mqtt = require('mqtt');
require('dotenv').config();

// Conectamos a localhost porque Mosquitto expone el puerto 1883 a tu PC
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('✅ Backend conectado a Mosquitto MQTT');
});

client.on('error', (err) => {
  console.error('❌ Error conexión MQTT:', err);
});

module.exports = client;