const express = require('express');
const Service = require('../models/Service');
const Salon = require('../models/Salon');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/services - kreira novu uslugu (samo za vlasnika salona)
router.post('/', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const { naziv, cena, trajanje, opis } = req.body;
    const user_id = req.user.id;

    // Pronađi salon korisnika
    const salon = await Salon.findByUserId(user_id);
    if (!salon) {
      return res.status(403).json({
        success: false,
        message: 'Nemate registrovan salon'
      });
    }

    // Validacija inputa
    if (!naziv || !cena || !trajanje) {
      return res.status(400).json({
        success: false,
        message: 'Naziv, cena i trajanje su obavezni'
      });
    }

    const newService = await Service.create({
      salon_id: salon.id,
      naziv,
      cena,
      trajanje,
      opis: opis || null
    });

    res.status(201).json({
      success: true,
      message: 'Usluga uspešno kreirana',
      data: { service: newService }
    });
  } catch (error) {
    console.error('Greška pri kreiranju usluge:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri kreiranju usluge' });
  }
});

// GET /api/salons/:salon_id/services - vraća sve usluge za dati salon
router.get('/salons/:salon_id/services', async (req, res) => {
  try {
    const { salon_id } = req.params;
    const services = await Service.findBySalonId(salon_id);
    res.json({ success: true, data: { services, count: services.length } });
  } catch (error) {
    console.error('Greška pri dohvatanju usluga:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri dohvatanju usluga' });
  }
});

// PUT /api/services/:id - ažurira uslugu (samo vlasnik)
router.put('/:id', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const { id } = req.params;
    const { naziv, cena, trajanje, opis } = req.body;
    const user_id = req.user.id;

    // Pronađi uslugu
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Usluga nije pronađena' });
    }

    // Pronađi salon korisnika
    const salon = await Salon.findByUserId(user_id);
    if (!salon || service.salon_id !== salon.id) {
      return res.status(403).json({ success: false, message: 'Nemate dozvolu za izmenu ove usluge' });
    }

    // Validacija inputa
    if (!naziv || !cena || !trajanje) {
      return res.status(400).json({ success: false, message: 'Naziv, cena i trajanje su obavezni' });
    }

    const updatedService = await Service.update(id, { naziv, cena, trajanje, opis: opis || null });
    res.json({ success: true, message: 'Usluga uspešno ažurirana', data: { service: updatedService } });
  } catch (error) {
    console.error('Greška pri ažuriranju usluge:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri ažuriranju usluge' });
  }
});

// DELETE /api/services/:id - briše uslugu (samo vlasnik)
router.delete('/:id', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Pronađi uslugu
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Usluga nije pronađena' });
    }

    // Pronađi salon korisnika
    const salon = await Salon.findByUserId(user_id);
    if (!salon || service.salon_id !== salon.id) {
      return res.status(403).json({ success: false, message: 'Nemate dozvolu za brisanje ove usluge' });
    }

    await Service.delete(id);
    res.json({ success: true, message: 'Usluga uspešno obrisana' });
  } catch (error) {
    console.error('Greška pri brisanju usluge:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri brisanju usluge' });
  }
});

// GET /test - test ruta za proveru dostupnosti
router.get('/test', (req, res) => {
  res.json({ message: 'Rute iz services.js su dostupne.' });
});

module.exports = router; 