const db = require('../utils/db');

const shoppingModel = {
  getAllShopping: async () => {
    const sql = 'SELECT * FROM shopping';
    return await db.query(sql);
  },

  getShoppingById: async (id) => {
    const sql = 'SELECT * FROM shopping WHERE id = ?';
    const values = [id];
    const results = await db.query(sql, values);
    return results[0];
  },

  createShopping: async (shoppingData) => {
    const { user_id, package_id, purchase_date, expiration_date, payment_method, receipt } = shoppingData;
    const sql = `
      INSERT INTO shopping (user_id, package_id, purchase_date, expiration_date, payment_method, receipt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [user_id, package_id, purchase_date, expiration_date, payment_method, receipt];
    const result = await db.query(sql, values);
    return result.insertId;
  },

  updateShopping: async (id, shoppingData) => {
    const { user_id, package_id, purchase_date, expiration_date, payment_method, receipt } = shoppingData;
    const sql = `
      UPDATE shopping
      SET user_id = ?, package_id = ?, purchase_date = ?, expiration_date = ?, payment_method = ?, receipt = ?
      WHERE id = ?
    `;
    const values = [user_id, package_id, purchase_date, expiration_date, payment_method, receipt, id];
    await db.query(sql, values);
  },

  deleteShopping: async (id) => {
    const sql = 'DELETE FROM shopping WHERE id = ?';
    const values = [id];
    await db.query(sql, values);
  },
};

module.exports = shoppingModel;