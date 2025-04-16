const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas de usuarios
const packageRoutes = require('./routes/packageRoutes'); // Importa las rutas de packages
const config = require('./config/config');
const db = require('./utils/db');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = config.server.port;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/users', userRoutes); // Usa las rutas de usuarios
app.use('/packages', packageRoutes); // Usa las rutas de packages

// Ruta de inicio (opcional)
app.get('/', (req, res) => {
  res.send('API REST de Zenith Studio Backend');
});

// Función para crear el usuario administrador inicial
async function createAdminUser() {
  try {
    const username = 'admin';
    const email = 'admin@example.com';
    const photo = 'https://example.com/admin.jpg'; // Reemplaza con una URL de foto válida
    const password = await bcrypt.hash('Admin1234..', 10); // Hashear la contraseña
    const name = 'Administrador';
    const status = 'approved';
    const phone = '012345678901';

    // Verificar si el usuario administrador ya existe
    const checkAdminUserQuery = 'SELECT * FROM users WHERE username = ?';
    const adminUser = await db.query(checkAdminUserQuery, [username]);

    if (adminUser.length === 0) {
      // Si no existe, crear el usuario administrador
      const insertAdminUserQuery = `
        INSERT INTO users (username, email, photo, password, name, status, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(insertAdminUserQuery, [username, email, photo, password, name, status, phone]);
      console.log('Usuario administrador creado exitosamente');
    } else {
      console.log('El usuario administrador ya existe');
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  }
}

// Iniciar el servidor y crear el usuario administrador
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  createAdminUser(); // Llama a la función para crear el admin
});