require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// JWT secret key (u produkciji bi trebalo da bude u environment varijabli)
const JWT_SECRET = process.env.JWT_SECRET || 'veloura-secret-key-2024';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registruje novog korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 description: Ime korisnika
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresa
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Lozinka (minimum 6 karaktera)
 *               role:
 *                 type: string
 *                 enum: [klijent, salon]
 *                 description: Uloga korisnika
 *               phone:
 *                 type: string
 *                 description: Broj telefona (opciono)
 *     responses:
 *       201:
 *         description: Korisnik uspešno registrovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Neispravni podaci
 *       409:
 *         description: Korisnik već postoji
 *       500:
 *         description: Greška na serveru
 */
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

    try {
      // ✅ Provera da li korisnik već postoji
      const userExists = await User.emailExists(email);
      if (userExists) {
        return res.status(409).json({ error: 'Korisnik sa ovim email-om već postoji' });
      }

      // 🔐 Hash lozinke i kreiranje korisnika
      const newUser = await User.create({ name, email, password, role, phone });

      // 🎟️ Generiši JWT token
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registracija uspešna',
        user: newUser,
        token,
      });

    } catch (err) {
      console.error('Greška pri registraciji:', err);
      res.status(500).json({ error: 'Greška na serveru' });
    }
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijavljuje korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresa
 *               password:
 *                 type: string
 *                 description: Lozinka
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Neispravni podaci
 *       401:
 *         description: Pogrešan email ili lozinka
 *       500:
 *         description: Greška na serveru
 */
// POST /login - autentifikacija korisnika
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Unesite validan email'),
    body('password').notEmpty().withMessage('Lozinka je obavezna'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
      }

      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Pogrešan email ili lozinka' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Ne vraćamo lozinku nazad
      const { password: _, ...safeUser } = user;

      res.status(200).json({
        message: 'Uspešna prijava',
        user: safeUser,
        token,
      });

    } catch (err) {
      console.error('Greška pri loginu:', err);
      res.status(500).json({ error: 'Greška na serveru' });
    }
  }
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Dohvata profil trenutnog korisnika
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token je potreban za pristup
 *       500:
 *         description: Greška na serveru
 */
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

// GET /me - vrati podatke o trenutno prijavljenom korisniku
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen' });
    }

    const { password: _, ...safeUser } = user; // Ukloni lozinku
    res.status(200).json({ user: safeUser });

  } catch (err) {
    console.error('Greška pri dohvatanju korisnika:', err);
    res.status(500).json({ error: 'Greška na serveru' });
  }
});

module.exports = router; 