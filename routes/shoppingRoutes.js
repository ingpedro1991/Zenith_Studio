const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

// Rutas para shopping
router.get('/', authMiddleware.verifyToken, shoppingController.getAllShopping); // Requiere autenticación
router.get('/:id', authMiddleware.verifyToken, shoppingController.getShoppingById); // Requiere autenticación
router.post('/', authMiddleware.verifyToken, shoppingController.createShopping); // Requiere autenticación
router.put('/:id', authMiddleware.verifyToken, shoppingController.updateShopping); // Requiere autenticación

//solo el admin
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, shoppingController.deleteShopping); // Requiere autenticación y ser administrador


module.exports = router;