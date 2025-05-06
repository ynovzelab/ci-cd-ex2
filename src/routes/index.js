const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const metricsRoutes = require('./metricsRoutes');

// Health check endpoint pour Render
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes des feedbacks
router.use('/feedback', feedbackRoutes);

// Routes des métriques
router.use('/metrics', metricsRoutes);

module.exports = router;
