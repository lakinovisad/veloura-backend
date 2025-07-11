const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const router = express.Router();

// JWT secret key (u produkciji bi trebalo da bude u environment varijabli)
const JWT_SECRET = process.env.JWT_SECRET || 'veloura-secret-key-2024';

// POST /register - registruje novog korisnika
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Ime je obavezno'),
    body('email').isEmail().withMessage('Nevalidna email adresa'),
    body('password').isLength({ min: 6 }).withMessage('Lozinka mora imati najmanje 6 karaktera'),
    body('role').isIn(['klijent', 'salon']).withMessage('Neispravna uloga'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone } = req.body;
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();

    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const db = require('../db').db;
      db.run(
        `INSERT INTO Users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, email, hashedPassword, role, phone],
        function (err) {
          if (err) {
            return res.status(500).json({ error: 'Greška pri registraciji korisnika' });
          }
          res.status(201).json({ message: 'Korisnik uspešno registrovan', id });
        }
      );
    } catch (err) {
      res.status(500).json({ error: 'Interna greška servera' });
    }
  }
);

// POST /login - autentifikuje korisnika
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Nevalidna email adresa'),
    body('password').notEmpty().withMessage('Lozinka je obavezna'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const db = require('../db').db;

    db.get(`SELECT * FROM Users WHERE email = ?`, [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Greška na serveru' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Neispravan email ili lozinka' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Neispravan email ili lozinka' });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    });
  }
);

// GET /profile - dohvati profil trenutnog korisnika (zaštićen endpoint)
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token je potreban za pristup'
      });
    }

    // Verifikuj token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          created_at: user.created_at
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Neispravan token'
      });
    }
    
    console.error('Greška pri dohvatanju profila:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru'
    });
  }
});

module.exports = router; 