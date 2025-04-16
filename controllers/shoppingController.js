const shoppingModel = require('../models/shoppingModel');
const { validationResult, body } = require('express-validator');

const shoppingController = {
  getAllShopping: async (req, res) => {
    try {
      const shopping = await shoppingModel.getAllShopping();
      res.json(shopping);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las compras' });
    }
  },

  getShoppingById: async (req, res) => {
    const id = req.params.id;
    try {
      const shopping = await shoppingModel.getShoppingById(id);
      if (!shopping) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      res.json(shopping);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la compra' });
    }
  },

  createShopping: [
    body('user_id').isInt({ min: 1 }).withMessage('user_id debe ser un entero positivo'),
    body('package_id').isInt({ min: 1 }).withMessage('package_id debe ser un entero positivo'),
    body('purchase_date').isISO8601().withMessage('purchase_date debe ser una fecha ISO8601 válida'),
    body('expiration_date').isISO8601().withMessage('expiration_date debe ser una fecha ISO8601 válida'),
    body('payment_method').isIn(['efectivo', 'transferencia']).withMessage('Método de pago inválido'),
    body('receipt').optional().isURL().withMessage('receipt debe ser una URL válida'), // Opcional y debe ser URL

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const shoppingId = await shoppingModel.createShopping(req.body);
        const nuevaCompra = await shoppingModel.getShoppingById(shoppingId);
        res.status(201).json({ message: 'Compra creada exitosamente', compra: nuevaCompra });
      } catch (error) {
        console.error("Error al crear compra:", error);
        res.status(500).json({ message: 'Error al crear la compra' });
      }
    },
  ],

  updateShopping: [
        body('user_id').optional().isInt({ min: 1 }).withMessage('user_id debe ser un entero positivo'),
        body('package_id').optional().isInt({ min: 1 }).withMessage('package_id debe ser un entero positivo'),
        body('purchase_date').optional().isISO8601().withMessage('purchase_date debe ser una fecha ISO8601 válida'),
        body('expiration_date').optional().isISO8601().withMessage('expiration_date debe ser una fecha ISO8601 válida'),
        body('payment_method').optional().isIn(['efectivo', 'transferencia']).withMessage('Método de pago inválido'),
        body('receipt').optional().isURL().withMessage('receipt debe ser una URL válida'), // Opcional y debe ser URL
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.params.id;
      try {
        const compraExistente = await shoppingModel.getShoppingById(id);
        if (!compraExistente) {
          return res.status(404).json({ message: 'Compra no encontrada' });
        }
        await shoppingModel.updateShopping(id, req.body);
        const compraActualizada = await shoppingModel.getShoppingById(id);
        res.json({ message: 'Compra actualizada exitosamente', compra: compraActualizada });
      } catch (error) {
        console.error("Error al actualizar compra:", error);
        res.status(500).json({ message: 'Error al actualizar la compra' });
      }
    },
  ],

  deleteShopping: async (req, res) => {
    const id = req.params.id;
    try {
      const compraExistente = await shoppingModel.getShoppingById(id);
      if (!compraExistente) {
        return res.status(404).json({ message: 'Compra no encontrada' });
      }
      await shoppingModel.deleteShopping(id);
      res.json({ message: 'Compra eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la compra' });
    }
  },
};

module.exports = shoppingController;