const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Route d'inscription
router.post('/register', authController.register);

// Route de connexion
router.post('/login', authController.login);

// Route pour vérifier l'authentification
router.get('/me', authenticate, authController.me);

// Route de déconnexion
router.post('/logout', authenticate, authController.logout);

module.exports = router;
