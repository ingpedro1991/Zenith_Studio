const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const bcrypt = require('bcrypt');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  },

  getUserById: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await userModel.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  },

    createUser: async (req, res) => {
        const { username, email, photo, password, name, status } = req.body;

        if (!username || !email || !password || !name || !status) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }
        if (status !== 'pending' && status !== 'approved' && status !== 'canceled') {
            return res.status(400).json({ message: 'El estado debe ser "pending", "approved" o "canceled"' });
        }

        try {
            const existingUserByUsername = await userModel.getUserByUsername(username);
            if (existingUserByUsername) {
                return res.status(400).json({ message: 'El username ya está en uso' });
            }

            const newUser = { username, email, photo, password, name, status };
            const userId = await userModel.createUser(newUser);
            const user = await userModel.getUserById(userId);
            res.status(201).json({ message: 'Usuario creado exitosamente', user: user });
        } catch (error) {
            console.error("Error al crear usuario:", error);
            res.status(500).json({ message: 'Error al crear el usuario' });
        }
    },

  updateUser: async (req, res) => {
    const id = req.params.id;
    const { username, email, photo, password, name, status } = req.body;

    try {
      const userToUpdate = await userModel.getUserById(id);
      if (!userToUpdate) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      if (req.user.username !== 'admin' && req.user.username !== userToUpdate.username) {
        return res.status(403).json({ message: 'No tienes permiso para actualizar este usuario' });
      }

      const userData = { username, email, photo, password, name, status };
      await userModel.updateUser(id, userData);
      const updatedUser = await userModel.getUserById(id);
      res.json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  },

  deleteUser: async (req, res) => {
    const id = req.params.id;
    try {
      const userToDelete = await userModel.getUserById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
      await userModel.deleteUser(id);
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await userModel.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({ message: 'Inicio de sesión exitoso', token, user: {id: user.id, username: user.username, email: user.email} });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  },
};

module.exports = userController;