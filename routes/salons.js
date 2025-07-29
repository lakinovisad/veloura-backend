const express = require('express');
const Salon = require('../models/Salon');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/salons - kreira novi salon (samo za korisnike sa role: "salon")
router.post('/', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const { naziv, lokacija, opis, radno_vreme } = req.body;
    const user_id = req.user.id;

    // Validacija input-a
    if (!naziv || !lokacija) {
      return res.status(400).json({
        success: false,
        message: 'Naziv i lokacija su obavezni'
      });
    }

    // Provera da li korisnik već ima salon
    const userHasSalon = await Salon.userHasSalon(user_id);
    if (userHasSalon) {
      return res.status(409).json({
        success: false,
        message: 'Već imate registrovan salon'
      });
    }

    // Kreiraj novi salon
    const newSalon = await Salon.create({
      user_id,
      naziv,
      lokacija,
      opis: opis || null,
      radno_vreme: radno_vreme || null
    });

    res.status(201).json({
      success: true,
      message: 'Salon uspešno kreiran',
      data: {
        salon: newSalon
      }
    });

  } catch (error) {
    console.error('Greška pri kreiranju salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri kreiranju salona'
    });
  }
});

// GET /api/salons - vraća sve salone
router.get('/', async (req, res) => {
  try {
    const salons = await Salon.findAll();

    res.json({
      success: true,
      data: {
        salons,
        count: salons.length
      }
    });

  } catch (error) {
    console.error('Greška pri dohvatanju salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri dohvatanju salona'
    });
  }
});

// GET /api/salons/:id - vraća jedan salon po ID-u
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const salon = await Salon.findById(id);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon nije pronađen'
      });
    }

    res.json({
      success: true,
      data: {
        salon
      }
    });

  } catch (error) {
    console.error('Greška pri dohvatanju salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri dohvatanju salona'
    });
  }
});

// GET /api/salons/:id/services - vraća sve usluge za dati salon sa paginacijom
router.get('/:id/services', async (req, res) => {
  try {
    const { id } = req.params;
    const { sort, order, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    // Proveri da li salon postoji
    const salon = await Salon.findById(id);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon nije pronađen'
      });
    }
    
    // Importuj Service model
    const Service = require('../models/Service');
    
    // Ako nema filtera, koristi paginaciju
    if (!search && !minPrice && !maxPrice && !sort) {
      const result = await Service.findBySalonIdPaginated(id, parseInt(page), parseInt(limit));
      return res.json({ 
        success: true, 
        data: { 
          services: result.services, 
          count: result.services.length,
          pagination: result.pagination 
        } 
      });
    }
    
    // Ako ima filtera, koristi staru logiku bez paginacije
    let services = await Service.findBySalonId(id);
    
    // Pretraživanje po nazivu
    if (search) {
      services = services.filter(service => 
        service.naziv.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtriranje po ceni
    if (minPrice) {
      services = services.filter(service => service.cena >= parseInt(minPrice));
    }
    if (maxPrice) {
      services = services.filter(service => service.cena <= parseInt(maxPrice));
    }
    
    // Sortiranje
    if (sort === 'price') {
      services.sort((a, b) => {
        if (order === 'desc') {
          return b.cena - a.cena;
        } else {
          return a.cena - b.cena;
        }
      });
    } else if (sort === 'name') {
      services.sort((a, b) => {
        if (order === 'desc') {
          return b.naziv.localeCompare(a.naziv);
        } else {
          return a.naziv.localeCompare(b.naziv);
        }
      });
    }
    
    res.json({ success: true, data: { services, count: services.length } });
  } catch (error) {
    console.error('Greška pri dohvatanju usluga:', error);
    res.status(500).json({ success: false, message: 'Greška na serveru pri dohvatanju usluga' });
  }
});

// PUT /api/salons/:id - ažurira salon (samo vlasnik salona)
router.put('/:id', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const { id } = req.params;
    const { naziv, lokacija, opis, radno_vreme } = req.body;
    const user_id = req.user.id;

    // Pronađi salon
    const salon = await Salon.findById(id);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon nije pronađen'
      });
    }

    // Provera da li je korisnik vlasnik salona
    if (salon.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za ažuriranje ovog salona'
      });
    }

    // Validacija input-a
    if (!naziv || !lokacija) {
      return res.status(400).json({
        success: false,
        message: 'Naziv i lokacija su obavezni'
      });
    }

    // Ažuriraj salon
    const updatedSalon = await Salon.update(id, {
      naziv,
      lokacija,
      opis: opis || null,
      radno_vreme: radno_vreme || null
    });

    res.json({
      success: true,
      message: 'Salon uspešno ažuriran',
      data: {
        salon: updatedSalon
      }
    });

  } catch (error) {
    console.error('Greška pri ažuriranju salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri ažuriranju salona'
    });
  }
});

// DELETE /api/salons/:id - briše salon (samo vlasnik salona)
router.delete('/:id', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Pronađi salon
    const salon = await Salon.findById(id);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Salon nije pronađen'
      });
    }

    // Provera da li je korisnik vlasnik salona
    if (salon.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate dozvolu za brisanje ovog salona'
      });
    }

    // Obriši salon
    await Salon.delete(id);

    res.json({
      success: true,
      message: 'Salon uspešno obrisan'
    });

  } catch (error) {
    console.error('Greška pri brisanju salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri brisanju salona'
    });
  }
});

// GET /api/salons/my/salon - dohvata salon trenutnog korisnika
router.get('/my/salon', authenticateToken, requireRole('salon'), async (req, res) => {
  try {
    const user_id = req.user.id;

    const salon = await Salon.findByUserId(user_id);
    if (!salon) {
      return res.status(404).json({
        success: false,
        message: 'Nemate registrovan salon'
      });
    }

    res.json({
      success: true,
      data: {
        salon
      }
    });

  } catch (error) {
    console.error('Greška pri dohvatanju salona:', error);
    res.status(500).json({
      success: false,
      message: 'Greška na serveru pri dohvatanju salona'
    });
  }
});

module.exports = router; 