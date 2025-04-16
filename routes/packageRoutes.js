const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', packageController.getAllpackages);
router.get('/:id', packageController.getpackageById);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, packageController.createpackage);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, packageController.updatepackage);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, packageController.deletepackage);

module.exports = router;