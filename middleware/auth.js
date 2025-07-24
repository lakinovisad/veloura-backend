const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'veloura-secret-key-2024';

// Middleware za verifikaciju JWT tokena
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token je potreban'
      });
    }

    // Verifikuj token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Pronađi korisnika u bazi
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }

    // Dodaj korisnika u request objekat
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Neispravan token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token je istekao'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru'
    });
  }
};

// Middleware za proveru role
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentifikacija je potrebna'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Pristup odbijen. Potrebna role: ${role}`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
}; 