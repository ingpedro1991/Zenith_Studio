const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/authMiddleware')


router.get('/', authMiddleware.verifyToken, shoppingController.getAllShopping);
router.get('/:id', authMiddleware.verifyToken, shoppingController.getShoppingById);
router.post('/', authMiddleware.verifyToken, shoppingController.createShopping);
router.put('/:id', authMiddleware.verifyToken, shoppingController.updateShopping); 


router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, shoppingController.deleteShopping);


module.exports = router;