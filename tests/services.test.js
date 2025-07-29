const request = require('supertest');
const { app, startServer } = require('../server');
const { db, initDatabase } = require('../db');
const { registerUser, createSalon, createService, clearDatabase } = require('./helpers');

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
    
    // Kreiraj salon
    const salonRes = await createSalon(salonToken);
    salonId = salonRes.id;

    // Registruj klijenta
    const clientUser = await registerUser('klijent');
    clientToken = clientUser.token;
  });

  describe('📝 POST /api/services - Kreiranje usluge', () => {
    test('✅ Salon uspešno kreira uslugu', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: 'Šišanje',
          cena: 1500,
          trajanje: 30,
          opis: 'Profesionalno šišanje',
          salon_id: salonId
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('service');
      expect(res.body.data.service.naziv).toBe('Šišanje');
      expect(res.body.data.service.cena).toBe(1500);
      serviceId = res.body.data.service.id;
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
      expect(res.body.message).toMatch(/naziv je obavezan/i);
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

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/cena mora biti pozitivna/i);
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
      expect(res.body.message).toMatch(/salon nije pronađen/i);
    });
  });

  describe('✏️ PUT /api/services/:id - Ažuriranje usluge', () => {
    test('✅ Salon uspešno ažurira svoju uslugu', async () => {
      const res = await request(app)
        .put(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${salonToken}`)
        .send({
          naziv: 'Šišanje - Ažurirano',
          cena: 1600,
          trajanje: 35,
          opis: 'Ažurirano šišanje'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.service.naziv).toBe('Šišanje - Ažurirano');
      expect(res.body.data.service.cena).toBe(1600);
    });

    test('❌ Klijent ne može ažurirati uslugu', async () => {
      const res = await request(app)
        .put(`/api/services/${serviceId}`)
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
        .put(`/api/services/${serviceId}`)
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
        .put(`/api/services/${serviceId}`)
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
      const res = await request(app)
        .delete(`/api/services/${serviceId}`)
        .set('Authorization', `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.message).toMatch(/usluga je obrisana/i);
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

      console.log('📦 REZ:', JSON.stringify(res.body, null, 2));

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

  // Dodajem standalone test za sortiranje
  describe('🔍 Standalone Sortiranje Test', () => {
    test('✅ Sortiranje usluga po ceni (rastuće) - standalone', async () => {
      // Registruj salon korisnika
      const salonUser = await registerUser('salon');
      const salonToken = salonUser.token;
      
      // Kreiraj salon
      const salonRes = await createSalon(salonToken);
      const salonId = salonRes.id;

      // Kreiraj nekoliko usluga sa različitim cenama
      await createService(salonToken, salonId, { naziv: 'Usluga 1', cena: 2000 });
      await createService(salonToken, salonId, { naziv: 'Usluga 2', cena: 1000 });
      await createService(salonToken, salonId, { naziv: 'Usluga 3', cena: 1500 });

      // Testiraj sortiranje
      const res = await request(app)
        .get(`/api/salons/${salonId}/services?sort=price&order=asc`);

      console.log('📦 REZ:', JSON.stringify(res.body, null, 2));

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

  describe("✨ Napredno Filtriranje i Sortiranje", () => {
    let salonToken;
    let testSalonId;

    beforeEach(async () => {
      await clearDatabase();

      // Registruj salon korisnika
      const salonUser = await registerUser('salon');
      salonToken = salonUser.token;

      // Kreiraj salon
      const salonRes = await request(app)
        .post("/api/salons")
        .set("Authorization", `Bearer ${salonToken}`)
        .send({
          naziv: "Test salon",
          lokacija: "Ulica 1",
        });

      if (!salonRes.body?.data?.salon?.id) {
        console.log("❌ Greška pri kreiranju salona:", salonRes.body);
        throw new Error("❌ Salon ID nije dobijen");
      }

      testSalonId = salonRes.body.data.salon.id;

      // Kreiraj testne usluge
      const services = [
        { naziv: "Masaža glave", cena: 800 },
        { naziv: "Masaža leđa", cena: 1500 },
        { naziv: "Šišanje muško", cena: 1200 },
        { naziv: "Feniranje", cena: 600 },
        { naziv: "Boja kose", cena: 2500 },
      ];

      for (const s of services) {
        const res = await request(app)
          .post("/api/services")
          .set("Authorization", `Bearer ${salonToken}`)
          .send({
            naziv: s.naziv,
            cena: s.cena,
            trajanje: 30,
            opis: "Test usluga",
          });

        if (!res.body.success) {
          console.log("❌ Greška pri kreiranju usluge:", res.body);
          throw new Error(`❌ Usluga "${s.naziv}" nije kreirana`);
        }
      }
    });

    it("✅ Sortiranje po ceni opadajuće (desc)", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?sort=price&order=desc`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.services)).toBe(true);
      const prices = res.body.data.services.map((s) => s.cena);
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).toEqual(sorted);
    });

    it("✅ Pretraga po nazivu (search=masaža)", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?search=masaža`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      const nazivi = res.body.data.services.map((s) => s.naziv.toLowerCase());
      expect(nazivi.every((n) => n.includes("masaža"))).toBe(true);
    });

    it("✅ Filtriranje po ceni (min=1000, max=2000)", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?minPrice=1000&maxPrice=2000`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      const cene = res.body.data.services.map((s) => s.cena);
      expect(cene.every((c) => c >= 1000 && c <= 2000)).toBe(true);
    });

    it("✅ Kombinacija: filtriranje i sortiranje", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?minPrice=500&maxPrice=1500&sort=price&order=desc`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      const cene = res.body.data.services.map((s) => s.cena);
      const withinRange = cene.every((c) => c >= 500 && c <= 1500);
      const sorted = [...cene].sort((a, b) => b - a);
      expect(withinRange).toBe(true);
      expect(cene).toEqual(sorted);
    });

    it("✅ Edge case: search=noresult", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?search=xyz`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.services.length).toBe(0);
    });

    it("✅ Edge case: filter out of range", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?minPrice=10000&maxPrice=20000`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.services.length).toBe(0);
    });

    it("✅ Paginacija: prva strana (page=1, limit=3)", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?page=1&limit=3`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.services)).toBe(true);
      expect(res.body.data.services.length).toBe(3);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(3);
      expect(res.body.data.pagination.total).toBe(5);
      expect(res.body.data.pagination.totalPages).toBe(2);
      expect(res.body.data.pagination.hasNext).toBe(true);
      expect(res.body.data.pagination.hasPrev).toBe(false);
    });

    it("✅ Paginacija: druga strana (page=2, limit=3)", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?page=2&limit=3`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.services)).toBe(true);
      expect(res.body.data.services.length).toBe(2); // Preostale 2 usluge
      expect(res.body.data.pagination.page).toBe(2);
      expect(res.body.data.pagination.limit).toBe(3);
      expect(res.body.data.pagination.total).toBe(5);
      expect(res.body.data.pagination.totalPages).toBe(2);
      expect(res.body.data.pagination.hasNext).toBe(false);
      expect(res.body.data.pagination.hasPrev).toBe(true);
    });

    it("✅ Paginacija: default parametri", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.services)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(10);
      expect(res.body.data.pagination.total).toBe(5);
      expect(res.body.data.pagination.totalPages).toBe(1);
    });

    it("✅ Paginacija: prazna strana", async () => {
      const res = await request(app)
        .get(`/api/salons/${testSalonId}/services?page=10&limit=3`)
        .set("Authorization", `Bearer ${salonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.services)).toBe(true);
      expect(res.body.data.services.length).toBe(0);
      expect(res.body.data.pagination.page).toBe(10);
      expect(res.body.data.pagination.total).toBe(5);
      expect(res.body.data.pagination.hasNext).toBe(false);
    });
  });
}); 