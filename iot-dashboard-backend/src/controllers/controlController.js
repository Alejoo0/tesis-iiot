const mqttClient = require('../config/mqttClient');
const db = require('../config/db'); // Importante: Tu conexión a Postgres

// 1. Enviar Comando (Con logs de depuración activados)
exports.sendCommand = async (req, res) => {
  console.log("1. Recibida petición de control:", req.body);
  
  const { machineId, action } = req.body;
  // Si usas JWT, req.user existe. Si no, usamos 'sistema'
  const username = req.user ? req.user.username : 'sistema';

  if (!machineId || !action) {
     return res.status(400).json({ message: "Faltan datos" });
  }

  const topic = `planta/${machineId}/cmd`;
  const payload = JSON.stringify({ action, user: username, timestamp: new Date() });

  console.log("2. Intentando publicar en MQTT...");
  
  // Verificamos si el cliente MQTT está conectado
  if (!mqttClient.connected) {
      console.error("ERROR: El cliente MQTT del backend NO está conectado.");
      return res.status(500).json({ message: "Error interno: Backend desconectado de MQTT" });
  }

  mqttClient.publish(topic, payload, async (err) => {
    if (err) {
      console.error("Error callback MQTT:", err);
      return res.status(500).json({ message: "Error al publicar MQTT" });
    }

    console.log(`3. Comando enviado a MQTT (${topic}). Guardando en DB...`);

    try {
      await db.query(
        'INSERT INTO audit_logs (username, machine_id, action, status) VALUES ($1, $2, $3, $4)',
        [username, machineId, action, 'SUCCESS']
      );
      console.log("4. Guardado en DB exitoso.");
      res.json({ message: `Orden enviada` });
    } catch (dbError) {
      console.error("Error guardando en Base de Datos:", dbError.message);
      // Respondemos éxito igual, porque la orden física SÍ salió
      res.json({ message: `Orden enviada (pero falló el log)` });
    }
  });
};

// 2. Obtener Historial (¡ESTA ES LA QUE FALTABA!)
exports.getAuditHistory = async (req, res) => {
  try {
    // Traemos los últimos 20 registros ordenados por fecha
    const result = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ message: 'Error obteniendo historial' });
  }
};