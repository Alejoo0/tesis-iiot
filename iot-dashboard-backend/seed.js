// seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./src/config/db'); // Importa tu conexión a la DB

const INITIAL_USERNAME = 'admin';
const INITIAL_PASSWORD = 'DaM20889.'; // ¡Cámbiala para producción!
const INITIAL_ROLE = 'Admin';
const SALT_ROUNDS = 10; // Nivel de seguridad de Bcrypt

async function seedUser() {
  try {
    // 1. Verificar si el usuario ya existe
    const checkUser = await db.query('SELECT id FROM users WHERE username = $1', [INITIAL_USERNAME]);
    if (checkUser.rows.length > 0) {
      console.log(`✅ Usuario '${INITIAL_USERNAME}' ya existe. Saltando creación.`);
      return;
    }

    // 2. Encriptar la contraseña
    console.log(`⏳ Creando hash para la contraseña...`);
    const passwordHash = await bcrypt.hash(INITIAL_PASSWORD, SALT_ROUNDS);

    // 3. Insertar el usuario en la base de datos
    const queryText = `
      INSERT INTO users (username, password_hash, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [INITIAL_USERNAME, passwordHash, 'admin@tesis.com', INITIAL_ROLE];
    
    const result = await db.query(queryText, values);

    console.log(`✨ Usuario '${INITIAL_USERNAME}' creado exitosamente con ID: ${result.rows[0].id}`);
    console.log(`   Rol: ${INITIAL_ROLE}`);
    console.log(`   Contraseña de prueba: ${INITIAL_PASSWORD}`);

  } catch (error) {
    console.error('❌ Error durante la inicialización de usuarios:', error.message);
  } finally {
    // Es crucial cerrar la conexión después de la operación
    // Nota: El 'pg' pool se cerrará al terminar el proceso de Node
  }
}

seedUser();