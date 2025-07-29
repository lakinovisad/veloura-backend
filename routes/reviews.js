const express = require('express');
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../db');

const router = express.Router();

// POST /api/reviews — kreira recenziju (samo za korisnike sa završenim tretmanima)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { salon_id, ocena, komentar } = req.body;
    const user_id = req.user.id;

    // Validacija inputa
    if (!salon_id || !ocena) {
      return res.status(400).json({
        success: false,
        message: 'Salon ID i ocena su obavezni'
      });
    }

    // Validacija ocene (1-5)
    if (ocena < 1 || ocena > 5 || !Number.isInteger(ocena)) {
      return res.status(400).json({
        success: false,
        message: 'Ocena mora biti ceo broj između 1 i 5'
      });
    }

    // Provera da li korisnik ima završen tretman u salonu
    const hasCompletedAppointment = await Review.hasCompletedAppointment(user_id, salon_id);
    if (!hasCompletedAppointment) {
      return res.status(403).json({
        success: false,
        message: 'Možete ostaviti recenziju samo za salone gde ste imali završen tretman'
      });
    }

    // Provera da li korisnik već ostavio recenziju za ovaj salon
    const hasReviewed = await Review.hasReviewed(user_id, salon_id);
    if (hasReviewed) {
      return res.status(409).json({
        success: false,
        message: 'Već ste ostavili recenziju za ovaj salon'
      });
    }

    // Kreiraj recenziju
    const newReview = await Review.create({
      user_id,
      salon_id,
      ocena,
      komentar: komentar || null
    });

    res.status(201).json({
      success: true,
      message: 'Recenzija uspešno kreirana',
      data: { review: newReview }
    });

  } catch (error) {
    console.error('Greška pri kreiranju recenzije:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri kreiranju recenzije'
    });
  }
});

// GET /api/salons/:id/reviews — vraća sve recenzije za salon
router.get('/salons/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.findBySalonId(id);

    res.json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('Greška pri dohvatanju recenzija salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri dohvatanju recenzija'
    });
  }
});

// GET /api/reviews/user/:id — vraća sve recenzije korisnika
router.get('/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Provera da li korisnik traži svoje recenzije ili je admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za pregled ovih recenzija'
      });
    }

    const reviews = await Review.findByUserId(id);

    res.json({
      success: true,
      data: {
        reviews,
        count: reviews.length
      }
    });

  } catch (error) {
    console.error('Greška pri dohvatanju recenzija korisnika:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri dohvatanju recenzija'
    });
  }
});

// PUT /api/reviews/:id — ažurira recenziju (samo vlasnik)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ocena, komentar } = req.body;
    const user_id = req.user.id;

    // Pronađi recenziju
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Recenzija nije pronađena'
      });
    }

    // Provera da li je korisnik vlasnik recenzije
    if (review.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za izmenu ove recenzije'
      });
    }

    // Validacija ocene
    if (ocena && (ocena < 1 || ocena > 5 || !Number.isInteger(ocena))) {
      return res.status(400).json({
        success: false,
        message: 'Ocena mora biti ceo broj između 1 i 5'
      });
    }

    const updatedReview = await Review.update(id, {
      ocena: ocena || review.ocena,
      komentar: komentar || review.komentar
    });

    res.json({
      success: true,
      message: 'Recenzija uspešno ažurirana',
      data: { review: updatedReview }
    });

  } catch (error) {
    console.error('Greška pri ažuriranju recenzije:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri ažuriranju recenzije'
    });
  }
});

// DELETE /api/reviews/:id — briše recenziju (samo vlasnik ili admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const review = await db.get('SELECT * FROM reviews WHERE id = ?', [id]);

    if (!review) {
      return res.status(404).json({ message: 'Recenzija nije pronađena.' });
    }

    if (review.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Nemate dozvolu da obrišete ovu recenziju.' });
    }

    await db.run('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Recenzija je obrisana.' });
  } catch (error) {
    res.status(500).json({ message: 'Greška prilikom brisanja recenzije.', error });
  }
});

module.exports = router; 