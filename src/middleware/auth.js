const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware d'authentification
exports.authenticate = async (req, res, next) => {
  try {
    // Essayer de récupérer le token du cookie d'abord, puis du header Authorization
    let token = req.Authorization || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token (middleware)' });
  }
};

// Middleware d'autorisation pour les admins
exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
