const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/userModel');

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Acceso no autorizado: Token inválido' });
    }
  },

  isAdmin: async (req, res, next) => {
      try {
          const user = await userModel.getUserByUsername(req.user.username);
          if (!user) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }

          if (user.username !== 'admin') {
              return res.status(403).json({ message: 'Acceso prohibido: Se requiere rol de administrador' });
          }
          next();
      } catch (error) {
          console.error("Error en isAdmin:", error);
          return res.status(500).json({ message: 'Error interno del servidor al verificar el rol' });
      }
  },
};

module.exports = authMiddleware;