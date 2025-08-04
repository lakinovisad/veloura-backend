const express = require('express');
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../db');

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Dodaj novu recenziju
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salon_id
 *               - ocena
 *             properties:
 *               salon_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID salona
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               ocena:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Ocena salona (1-5)
 *                 example: 4
 *               komentar:
 *                 type: string
 *                 description: Opcioni komentar
 *                 example: "Sjajna usluga i prijatno osoblje!"
 *     responses:
 *       201:
 *         description: Recenzija uspešno dodata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Neispravan zahtev - salon ID i ocena su obavezni ili ocena mora biti ceo broj između 1 i 5
 *       401:
 *         description: Neautorizovan pristup
 *       403:
 *         description: Možete ostaviti recenziju samo za salone gde ste imali završen tretman
 *       409:
 *         description: Već ste ostavili recenziju za ovaj salon
 *       500:
 *         description: Greška na serveru
 */
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

/**
 * @swagger
 * /api/reviews/salons/{id}/reviews:
 *   get:
 *     summary: Dohvata sve recenzije za salon
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID salona
 *     responses:
 *       200:
 *         description: Lista recenzija salona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     count:
 *                       type: number
 *       500:
 *         description: Greška na serveru
 */
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

/**
 * @swagger
 * /api/reviews/user/{id}:
 *   get:
 *     summary: Dohvata sve recenzije korisnika
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID korisnika
 *     responses:
 *       200:
 *         description: Lista recenzija korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     count:
 *                       type: number
 *       401:
 *         description: Neautorizovan pristup
 *       403:
 *         description: Nemate dozvolu za pregled ovih recenzija
 *       500:
 *         description: Greška na serveru
 */
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

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Ažurira recenziju
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID recenzije
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ocena:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Nova ocena (1-5)
 *                 example: 5
 *               komentar:
 *                 type: string
 *                 description: Novi komentar
 *                 example: "Odlična usluga, preporučujem!"
 *     responses:
 *       200:
 *         description: Recenzija uspešno ažurirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Ocena mora biti ceo broj između 1 i 5
 *       401:
 *         description: Neautorizovan pristup
 *       403:
 *         description: Nemate dozvolu za izmenu ove recenzije
 *       404:
 *         description: Recenzija nije pronađena
 *       500:
 *         description: Greška na serveru
 */
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

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Briše recenziju
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID recenzije
 *     responses:
 *       200:
 *         description: Recenzija je obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Neautorizovan pristup
 *       403:
 *         description: Nemate dozvolu da obrišete ovu recenziju
 *       404:
 *         description: Recenzija nije pronađena
 *       500:
 *         description: Greška prilikom brisanja recenzije
 */
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