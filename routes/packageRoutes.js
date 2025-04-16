const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.get('/', packageController.getAllpackages);
router.get('/:id', packageController.getpackageById);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, packageController.createpackage); // Solo admin
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, packageController.updatepackage); // Solo admin
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, packageController.deletepackage); // Solo admin

module.exports = router;