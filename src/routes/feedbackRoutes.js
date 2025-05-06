const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackController');

// Configuration de multer pour garder le fichier en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
});

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Récupérer tous les feedbacks de l'utilisateur connecté
router.get('/', feedbackController.getAllFeedbacks);

// Importer des feedbacks en masse
router.post('/bulk', upload.single('file'), feedbackController.importBulk);

module.exports = router;
