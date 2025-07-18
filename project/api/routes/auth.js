require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

console.log("✅ auth.js fajl je učitan");

const router = express.Router();

// JWT secret key (u produkciji bi trebalo da bude u environment varijabli)
const JWT_SECRET = process.env.JWT_SECRET || 'veloura-secret-key-2024';

// POST /register - registruje novog korisnika
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validacija input-a
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Sva polja su obavezna (name, email, password, role)'
      });
    }

    // Provera role
    if (!['klijent', 'salon'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role mora biti "klijent" ili "salon"'
      });
    }

    // Provera da li email već postoji
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Korisnik sa ovim email-om već postoji'
      });
    }

    // Kreiraj novog korisnika
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || null
    });

    // Generiši JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Korisnik uspešno registrovan',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Greška pri registraciji:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri registraciji'
    });
  }
});

// POST /login - autentifikuje korisnika
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validacija input-a
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email i lozinka su obavezni'
      });
    }

    // Pronađi korisnika po email-u
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Neispravan email ili lozinka'
      });
    }

    // Proveri lozinku
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Neispravan email ili lozinka'
      });
    }

    // Generiši JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Uspešna prijava',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        },
        token
      }
    });

  } catch (error) {
    console.error('Greška pri prijavi:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri prijavi'
    });
  }
});

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

// GET /test - test ruta za proveru dostupnosti
router.get('/test', (req, res) => {
  res.json({ message: 'Rute iz auth.js su dostupne.' });
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