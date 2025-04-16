const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/userModel');

const authMiddleware = {
  // Verificar token JWT
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado: Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded; // Almacena la información del usuario en el objeto de la petición
      next(); // Pasa al siguiente middleware o ruta
    } catch (error) {
      return res.status(401).json({ message: 'Acceso no autorizado: Token inválido' });
    }
  },

  // Verificar si el usuario es administrador
  isAdmin: async (req, res, next) => {
      try {
          // req.user contiene la información del usuario decodificada del token
          const user = await userModel.getUserByUsername(req.user.username);
          if (!user) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }
          // Adaptar esto a tu lógica de roles.  Aquí asumo que tienes un campo 'role'
          if (user.username !== 'admin') { // Cambiado a comparación de username
              return res.status(403).json({ message: 'Acceso prohibido: Se requiere rol de administrador' });
          }
          next();
      } catch (error) {
          console.error("Error en isAdmin:", error); // Log detallado
          return res.status(500).json({ message: 'Error interno del servidor al verificar el rol' });
      }
  },
};

module.exports = authMiddleware;