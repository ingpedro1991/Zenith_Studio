const db = require('../utils/db');

const packageModel = {
  getAllpackages: async () => {
    const sql = 'SELECT * FROM packages';
    return await db.query(sql);
  },

  getpackageById: async (id) => {
    const sql = 'SELECT * FROM packages WHERE id = ?';
    const values = [id];
    const results = await db.query(sql, values);
    return results[0];
  },

  createpackage: async (packageData) => {
    const { name, number_class, price, duration_days, status } = packageData;
    const sql = `
      INSERT INTO packages (name, number_class, price, duration_days, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, number_class, price, duration_days, status];
    const result = await db.query(sql, values);
    return result.insertId;
  },

  updatepackage: async (id, packageData) => {
    const { name, number_class, price, duration_days, status } = packageData;
    const sql = `
      UPDATE packages
      SET name = ?, number_class = ?, price = ?, duration_days = ?, status = ?
      WHERE id = ?
    `;
    const values = [name, number_class, price, duration_days, status, id];
    await db.query(sql, values);
  },

  deletepackage: async (id) => {
    const sql = 'DELETE FROM packages WHERE id = ?';
    const values = [id];
    await db.query(sql, values);
  },
};

module.exports = packageModel;