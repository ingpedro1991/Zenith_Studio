const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.post('/login', userController.login);
router.post('/register', userController.createUser);


// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.getAllUsers); // Solo admin
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, userController.updateUser); // Cualquier usuario puede actualizar su propio perfil
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, userController.deleteUser); // Solo admin

module.exports = router;
