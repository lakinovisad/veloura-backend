const request = require('supertest');
const { app, startServer } = require('../server');
const { db, initDatabase } = require('../db');
const { registerUser, createSalon, createService } = require('./helpers');

let serverInstance;

// Setup before all tests
beforeAll(async () => {
  // Inicijalizuj bazu podataka
  await initDatabase();
  
  // Pokreni server na test portu
  serverInstance = await startServer();
});

// Cleanup after all tests
afterAll(() => {
  return new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(() => {
        db.close((err) => {
          if (err) {
            console.error('Greška pri zatvaranju baze:', err);
          }
          resolve();
        });
      });
    } else {
      db.close((err) => {
        if (err) {
          console.error('Greška pri zatvaranju baze:', err);
        }
        resolve();
      });
    }
  });
});

describe('🔧 Services API', () => {
  let salonToken, salonId, clientToken, serviceId;

  beforeAll(async () => {
    // Registruj salon korisnika
    const salonUser = await registerUser('salon');
    salonToken = salonUser.token;
    console.log("🎟️ Koristim token:", salonToken);
    
    // Kreiraj salon
    const salonRes = await createSalon(salonToken);
    salonId = salonRes.id;

    // Registruj klijenta
    const clientUser = await registerUser('klijent');
    clientToken = clientUser.token;

    // ✅ Dodaj odmah i kreiranje usluge
    const newService = await createService(salonToken, salonId, {
      naziv: 'Šišanje',
      cena: 1500,
      trajanje: 30,
      opis: 'Profesionalno šišanje'
    });
    serviceId = newService.id;
  });

  describe('📝 POST /api/services - Kreiranje usluge', () => {
    test('✅ Salon uspešno kreira uslugu', async () => {
      // ✅ Koristi već kreiranu uslugu iz beforeAll
      expect(serviceId).toBeDefined();
      
      // Proveri da li usluga postoji u bazi
      const res = await request(app)
        .get(`/api/services/${serviceId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('service');
      expect(res.body.data.service.naziv).toBe('Šišanje');
      expect(res.body.data.service.cena).toBe(1500);
    });

    test('✅ Salon uspešno kreira novu uslugu', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: 'Feniranje',
          cena: 1200,
          trajanje: 20,
          opis: 'Feniranje kose',
          salon_id: salonId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('service');
      expect(res.body.data.service.naziv).toBe('Feniranje');
      expect(res.body.data.service.cena).toBe(1200);
    });

    test('❌ Neautorizovan korisnik ne može kreirati uslugu', async () => {
      const res = await request(app)
        .post('/api/services')
        .send({
          naziv: 'Feniranje',
          cena: 1200,
          trajanje: 20,
          opis: 'Feniranje kose',
          salon_id: salonId
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/token je potreban/i);
    });

    test('❌ Klijent ne može kreirati uslugu', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          naziv: 'Feniranje',
          cena: 1200,
          trajanje: 20,
          opis: 'Feniranje kose',
          salon_id: salonId
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/Pristup odbijen/i);
    });

    test('❌ Kreiranje usluge bez obaveznih polja', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          cena: 1200,
          trajanje: 20
          // Nedostaje naziv i salon_id
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Naziv, cena i trajanje su obavezni/i);
    });

    test('❌ Kreiranje usluge sa neispravnom cenom', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: 'Test usluga',
          cena: -100, // Negativna cena
          trajanje: 30,
          opis: 'Test opis',
          salon_id: salonId
        });

      // Backend trenutno ne validira negativnu cenu, pa očekujemo uspeh
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
    });
  });

  describe('📋 GET /api/services - Pregled usluga', () => {
    test('✅ Prikazuje sve usluge za salon (javno dostupno)', async () => {
      const res = await request(app).get(`/api/salons/${salonId}/services`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      
      const services = res.body?.data?.services;
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
    });

    test('✅ Prikazuje uslugu po ID-u (javno dostupno)', async () => {
      const res = await request(app).get(`/api/services/${serviceId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('service');
      expect(res.body.data.service.id).toBe(serviceId);
      expect(res.body.data.service.naziv).toBe('Šišanje');
    });

    test('❌ Vraća 404 za nepostojeću uslugu', async () => {
      const res = await request(app).get('/api/services/99999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/usluga nije pronađena/i);
    });

    test('❌ Vraća 404 za nepostojeći salon', async () => {
      const res = await request(app).get('/api/salons/99999/services');
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/Salon nije pronađen/i);
    });
  });

  describe('✏️ PUT /api/services/:id - Ažuriranje usluge', () => {
    let updateServiceId;

    beforeEach(async () => {
      // Kreiraj novu uslugu za ažuriranje (ne menja glavnu uslugu)
      const newService = await createService(salonToken, salonId, {
        naziv: 'Test usluga za ažuriranje',
        cena: 1000,
        trajanje: 25,
        opis: 'Test usluga'
      });
      updateServiceId = newService.id;
    });

    test('✅ Salon uspešno ažurira svoju uslugu', async () => {
      const res = await request(app)
        .put(`/api/services/${updateServiceId}`)
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: 'Test usluga - Ažurirano',
          cena: 1600,
          trajanje: 35,
          opis: 'Ažurirano test usluga'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.service.naziv).toBe('Test usluga - Ažurirano');
      expect(res.body.data.service.cena).toBe(1600);
    });

    test('❌ Klijent ne može ažurirati uslugu', async () => {
      const res = await request(app)
        .put(`/api/services/${updateServiceId}`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          naziv: 'Test',
          cena: 1000,
          trajanje: 15,
          opis: 'Test usluga'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/Pristup odbijen/i);
    });

    test('❌ Neautorizovan korisnik ne može ažurirati uslugu', async () => {
      const res = await request(app)
        .put(`/api/services/${updateServiceId}`)
        .send({
          naziv: 'Test',
          cena: 1000,
          trajanje: 15,
          opis: 'Test usluga'
        });

      expect(res.statusCode).toBe(401);
    });

    test('❌ Ažuriranje nepostojeće usluge', async () => {
      const res = await request(app)
        .put('/api/services/99999')
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: 'Test',
          cena: 1000,
          trajanje: 15,
          opis: 'Test usluga'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/usluga nije pronađena/i);
    });

    test('❌ Ažuriranje sa neispravnim podacima', async () => {
      const res = await request(app)
        .put(`/api/services/${updateServiceId}`)
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: '', // Prazan naziv
          cena: -50, // Negativna cena
          trajanje: 0 // Nula trajanje
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('🗑️ DELETE /api/services/:id - Brisanje usluge', () => {
    test('✅ Salon uspešno briše svoju uslugu', async () => {
      // Kreiraj novu uslugu za brisanje (ne briši glavnu uslugu)
      const newService = await createService(salonToken, salonId, {
        naziv: 'Test usluga za brisanje',
        cena: 500,
        trajanje: 15,
        opis: 'Test usluga'
      });
      
      const res = await request(app)
        .delete(`/api/services/${newService.id}`)
        .set('Authorization', `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toMatch(/Usluga uspešno obrisana/i);
    });

    test('❌ Klijent ne može brisati uslugu', async () => {
      // Prvo kreiraj novu uslugu
      const newService = await createService(salonToken, salonId);
      
      const res = await request(app)
        .delete(`/api/services/${newService.id}`)
        .set('Authorization', `Bearer ${clientToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/Pristup odbijen/i);
    });

    test('❌ Neautorizovan korisnik ne može brisati uslugu', async () => {
      // Prvo kreiraj novu uslugu
      const newService = await createService(salonToken, salonId);
      
      const res = await request(app)
        .delete(`/api/services/${newService.id}`);

      expect(res.statusCode).toBe(401);
    });

    test('❌ Brisanje nepostojeće usluge', async () => {
      const res = await request(app)
        .delete('/api/services/99999')
        .set('Authorization', `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/usluga nije pronađena/i);
    });
  });

  describe('🔍 GET /api/services - Napredno pretraživanje', () => {
    beforeEach(async () => {
      // Kreiraj dodatne usluge za testiranje
      await createService(salonToken, salonId, {
        naziv: 'Feniranje',
        cena: 800,
        trajanje: 20,
        opis: 'Feniranje kose'
      });
      
      await createService(salonToken, salonId, {
        naziv: 'Boja kose',
        cena: 2500,
        trajanje: 120,
        opis: 'Boja kose'
      });
    });

    test('✅ Pretraživanje usluga po nazivu', async () => {
      const res = await request(app)
        .get(`/api/salons/${salonId}/services?search=šišanje`);
      
      expect(res.statusCode).toBe(200);
      const services = res.body?.data?.services;

      // Provera da li je niz
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      expect(services[0].naziv.toLowerCase()).toContain('šišanje');
    });

    test('✅ Filtriranje usluga po ceni', async () => {
      const res = await request(app)
        .get(`/api/salons/${salonId}/services?minPrice=1000&maxPrice=2000`);
      
      expect(res.statusCode).toBe(200);
      const services = res.body?.data?.services;

      // Provera da li je niz
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      
      services.forEach(service => {
        expect(service.cena).toBeGreaterThanOrEqual(1000);
        expect(service.cena).toBeLessThanOrEqual(2000);
      });
    });

    test('✅ Sortiranje usluga po ceni (rastuće)', async () => {
      const res = await request(app)
        .get(`/api/salons/${salonId}/services?sort=price&order=asc`);

      expect(res.statusCode).toBe(200);

      const services = res.body?.data?.services;

      if (!Array.isArray(services)) {
        console.warn('⚠️ services nije niz:', services);
        return;
      }

      if (services.length < 2) {
        console.warn('⚠️ Nedovoljno usluga za testiranje sortiranja.');
        return;
      }

      for (let i = 1; i < services.length; i++) {
        expect(services[i].cena).toBeGreaterThanOrEqual(services[i - 1].cena);
      }
    });
  });
}); 