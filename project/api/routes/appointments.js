const express = require('express');
const Appointment = require('../models/Appointment');
const Salon = require('../models/Salon');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/appointments — kreira novi termin (samo klijent)
router.post('/', authenticateToken, requireRole('klijent'), async (req, res) => {
  try {
    const { salon_id, service_id, datum, vreme } = req.body;
    const user_id = req.user.id;

    if (!salon_id || !service_id || !datum || !vreme) {
      return res.status(400).json({ success: false, message: 'Sva polja su obavezna' });
    }

    const newAppointment = await Appointment.create({
      user_id,
      salon_id,
      service_id,
      datum,
      vreme,
      status: 'zakazano'
    });

    res.status(201).json({ success: true, message: 'Termin uspešno zakazan', data: { appointment: newAppointment } });
  } catch (error) {
    console.error('Greška pri zakazivanju termina:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri zakazivanju termina' });
  }
});

// GET /api/appointments/user/:id — svi termini jednog korisnika
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Samo vlasnik ili admin može da vidi
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Nemate dozvolu za pregled ovih termina' });
    }
    const appointments = await Appointment.findByUserId(id);
    res.json({ success: true, data: { appointments, count: appointments.length } });
  } catch (error) {
    console.error('Greška pri dohvatanju termina korisnika:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri dohvatanju termina' });
  }
});

// GET /api/appointments/salon/:id — svi termini za jedan salon
router.get('/salon/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Samo vlasnik salona ili admin može da vidi
    if (req.user.role !== 'admin') {
      const salon = await Salon.findByUserId(req.user.id);
      if (!salon || salon.id !== id) {
        return res.status(403).json({ success: false, message: 'Nemate dozvolu za pregled termina ovog salona' });
      }
    }
    const appointments = await Appointment.findBySalonId(id);
    res.json({ success: true, data: { appointments, count: appointments.length } });
  } catch (error) {
    console.error('Greška pri dohvatanju termina salona:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri dohvatanju termina' });
  }
});

// PUT /api/appointments/:id/status — ažurira status termina (samo salon ili admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['zakazano', 'otkazano', 'završeno'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Neispravan status' });
    }
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Termin nije pronađen' });
    }
    // Samo vlasnik salona ili admin može da menja status
    if (req.user.role !== 'admin') {
      const salon = await Salon.findByUserId(req.user.id);
      if (!salon || salon.id !== appointment.salon_id) {
        return res.status(403).json({ success: false, message: 'Nemate dozvolu za izmenu statusa ovog termina' });
      }
    }
    const updated = await Appointment.updateStatus(id, status);
    res.json({ success: true, message: 'Status termina uspešno ažuriran', data: updated });
  } catch (error) {
    console.error('Greška pri ažuriranju statusa termina:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri ažuriranju statusa termina' });
  }
});

// GET /test - test ruta za proveru dostupnosti
router.get('/test', (req, res) => {
  res.json({ message: 'Rute iz appointments.js su dostupne.' });
});

// PATCH /api/appointments/:id/status - promeni status termina (samo salon ili admin)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const dozvoljeniStatusi = ['zakazano', 'završen', 'otkazan'];
  if (!dozvoljeniStatusi.includes(status)) {
    return res.status(400).json({ error: 'Neispravan status' });
  }

  try {
    // Provera da li korisnik ima pravo (admin ili salon koji je vlasnik termina)
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Termin nije pronađen' });
    }

    if (req.user.role !== 'admin' && req.user.id !== appointment.user_id) {
      return res.status(403).json({ error: 'Nemate dozvolu da menjate ovaj termin' });
    }

    await Appointment.updateStatus(id, status);
    res.status(200).json({ message: 'Status uspešno ažuriran' });

  } catch (err) {
    console.error('Greška pri promeni statusa termina:', err);
    res.status(500).json({ error: 'Greška na serveru' });
  }
});

// GET /api/appointments/salon/:salon_id - svi termini za salon
router.get('/salon/:salon_id', authenticateToken, async (req, res) => {
  const { salon_id } = req.params;

  try {
    const appointments = await Appointment.findBySalonId(salon_id);
    res.status(200).json({ success: true, data: appointments });
  } catch (err) {
    console.error('Greška pri dohvaćanju termina za salon:', err);
    res.status(500).json({ success: false, error: 'Greška na serveru' });
  }
});

module.exports = router; 