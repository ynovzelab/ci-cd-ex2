const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const { authenticate } = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Répartition par canaux
router.get('/channels', metricsController.getChannelDistribution);

// Répartition par thèmes
router.get('/themes', metricsController.getThemeDistribution);

// Volume par jour
router.get('/daily-volume', metricsController.getDailyVolume);

// Moyenne de sentiment
router.get('/sentiment/average', metricsController.getSentimentAverage);

// Distribution des sentiments
router.get('/sentiment/distribution', metricsController.getSentimentDistribution);

// Pourcentage de feedbacks critiques
router.get('/sentiment/critical', metricsController.getCriticalPercentage);

module.exports = router;
