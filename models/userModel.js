const db = require('../utils/db');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Número de rondas de hashing

const userModel = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    const sql = 'SELECT id, username, email, photo, name, status, created_at, updated_at FROM users';
    return await db.query(sql);
  },

  // Obtener un usuario por ID
  getUserById: async (id) => {
    const sql = 'SELECT id, username, email, photo, name, status, created_at, updated_at FROM users WHERE id = ?';
    const values = [id];
    const results = await db.query(sql, values);
    return results[0]; // Devuelve el primer resultado o undefined
  },

  // Obtener un usuario por username
  getUserByUsername: async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?'; // Selecciona todos los campos
    const values = [username];
    const results = await db.query(sql, values);
    return results[0];
  },

  // Crear un nuevo usuario
  createUser: async (userData) => {
    const { username, email, photo, password, name, status } = userData;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = `
      INSERT INTO users (username, email, photo, password, name, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [username, email, photo, hashedPassword, name, status];
    const result = await db.query(sql, values);
    return result.insertId; // Devuelve el ID del usuario insertado
  },

  // Actualizar un usuario por ID
  updateUser: async (id, userData) => {
      const { username, email, photo, name, status } = userData;
      let sql = `
          UPDATE users SET username = ?, email = ?, photo = ?, name = ?, status = ?
      `;
      const values = [username, email, photo, name, status];

      // Si se proporciona una nueva contraseña, la hasheamos y la incluimos en la actualización
      if (userData.password) {
          const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
          sql += `, password = ?`;
          values.push(hashedPassword);
      }

      sql += ` WHERE id = ?`;
      values.push(id);

      return await db.query(sql, values);
  },

  // Eliminar un usuario por ID
  deleteUser: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const values = [id];
    return await db.query(sql, values);
  },
};

module.exports = userModel;