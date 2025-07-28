const request = require('supertest');
const { app, startServer } = require('../server');
const { db, initDatabase } = require('../db');
const {
  registerUser,
  loginUser,
  createSalon,
  createService
} = require('./helpers');

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
    // Registruj i prijavi salon korisnika
    const salonUser = await registerUser('salon');
    const loginSalon = await loginUser(salonUser.user.email, '123456');
    salonToken = loginSalon.token;
    
    const salonRes = await createSalon(salonToken);
    salonId = salonRes.id;

    // Registruj i prijavi klijenta
    const clientUser = await registerUser('klijent');
    const loginClient = await loginUser(clientUser.user.email, '123456');
    clientToken = loginClient.token;
  });

  test('✅ Kreiranje usluge za salon korisnika', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${salonToken}`)
      .send({
        naziv: 'Šišanje',
        cena: 1500,
        trajanje: 30,
        opis: 'Profesionalno šišanje'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('service');
    expect(res.body.data.service.naziv).toBe('Šišanje');
    serviceId = res.body.data.service.id;
  });

  test('❌ Neautorizovan korisnik ne može kreirati uslugu', async () => {
    const res = await request(app)
      .post('/api/services')
      .send({
        naziv: 'Feniranje',
        cena: 1200,
        trajanje: 20,
        opis: 'Feniranje kose'
      });

    expect(res.statusCode).toBe(401);
  });

  test('❌ Klijent ne može kreirati uslugu', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        naziv: 'Feniranje',
        cena: 1200,
        trajanje: 20,
        opis: 'Feniranje kose'
      });

    expect(res.statusCode).toBe(403);
  });

  test('✅ Pregled usluga za salon (javno dostupno)', async () => {
    const res = await request(app).get(`/api/services/salons/${salonId}/services`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('services');
    expect(Array.isArray(res.body.data.services)).toBe(true);
  });

  test('✅ Ažuriranje usluge od strane vlasnika', async () => {
    const res = await request(app)
      .put(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({
        naziv: 'Šišanje - Novo',
        cena: 1600,
        trajanje: 35,
        opis: 'Ažurirano šišanje'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.service.naziv).toBe('Šišanje - Novo');
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
  });

  test('✅ Brisanje usluge od strane vlasnika', async () => {
    const res = await request(app)
      .delete(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${salonToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
}); 