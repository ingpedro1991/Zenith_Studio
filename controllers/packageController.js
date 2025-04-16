const packageModel = require('../models/packageModel');
const { validationResult, body } = require('express-validator'); // Importa body desde express-validator

const packageController = {
  // Obtener todos los packages
  getAllpackages: async (req, res) => {
    try {
      const packages = await packageModel.getAllpackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los packages' });
    }
  },

  // Obtener un package por ID
  getpackageById: async (req, res) => {
    const id = req.params.id;
    try {
      const package = await packageModel.getpackageById(id);
      if (!package) {
        return res.status(404).json({ message: 'package no encontrado' });
      }
      res.json(package);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el package' });
    }
  },

  // Crear un nuevo package (solo admin)
  createpackage: [
    // Middleware de validación
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('number_class').isInt({ min: 1 }).withMessage('El número de clases debe ser un entero mayor que 0'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
    body('duration_days').isInt({ min: 1 }).withMessage('La duración en días debe ser un entero mayor que 0'),
    body('status').isIn(['activo', 'inactivo']).withMessage('El estado debe ser "activo" o "inactivo"'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const packageId = await packageModel.createpackage(req.body);
        const nuevopackage = await packageModel.getpackageById(packageId);
        res.status(201).json({ message: 'package creado exitosamente', package: nuevopackage });
      } catch (error) {
        console.error('Error al crear package:', error);
        res.status(500).json({ message: 'Error al crear el package' });
      }
    },
  ],

  // Actualizar un package por ID (solo admin)
  updatepackage: [
    // Middleware de validación
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('number_class').isInt({ min: 1 }).withMessage('El número de clases debe ser un entero mayor que 0'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor o igual a 0'),
    body('duration_days').isInt({ min: 1 }).withMessage('La duración en días debe ser un entero mayor que 0'),
    body('status').isIn(['activo', 'inactivo']).withMessage('El estado debe ser "activo" o "inactivo"'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.params.id;
      try {
        const packageExistente = await packageModel.getpackageById(id);
        if (!packageExistente) {
          return res.status(404).json({ message: 'package no encontrado' });
      }
        await packageModel.updatepackage(id, req.body);
        const packageActualizado = await packageModel.getpackageById(id);
        res.json({ message: 'package actualizado exitosamente', package: packageActualizado });
      } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el package' });
      }
    },
  ],

  // Eliminar un package por ID (solo admin)
  deletepackage: async (req, res) => {
    const id = req.params.id;
    try {
      const packageExistente = await packageModel.getpackageById(id);
      if (!packageExistente) {
        return res.status(404).json({ message: 'package no encontrado' });
      }
      await packageModel.deletepackage(id);
      res.json({ message: 'package eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el package' });
    }
  },
};

module.exports = packageController;
