const mysql = require('mysql');
const config = require('../config/config');

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  port: config.database.port,
  connectionLimit: 10,
});

const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

const releaseConnection = (connection) => {
  connection.release();
};

const query = async (sql, values) => {
    const connection = await getConnection();
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            releaseConnection(connection);
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
  query,
  getConnection,
  releaseConnection
};