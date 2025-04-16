const db = require('../utils/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userModel = {
  getAllUsers: async () => {
    const sql = 'SELECT id, username, email, photo, name, status, created_at, updated_at FROM users';
    return await db.query(sql);
  },

  getUserById: async (id) => {
    const sql = 'SELECT id, username, email, photo, name, status, created_at, updated_at FROM users WHERE id = ?';
    const values = [id];
    const results = await db.query(sql, values);
    return results[0];
  },

  getUserByUsername: async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
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
    return result.insertId;
  },

  updateUser: async (id, userData) => {
      const { username, email, photo, name, status } = userData;
      let sql = `
          UPDATE users SET username = ?, email = ?, photo = ?, name = ?, status = ?
      `;
      const values = [username, email, photo, name, status];

      if (userData.password) {
          const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
          sql += `, password = ?`;
          values.push(hashedPassword);
      }

      sql += ` WHERE id = ?`;
      values.push(id);

      return await db.query(sql, values);
  },

  deleteUser: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const values = [id];
    return await db.query(sql, values);
  },
};

module.exports = userModel;