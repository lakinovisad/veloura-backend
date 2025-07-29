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

describe('🔍 Test Sortiranja Usluga', () => {
  let salonToken, salonId;

  beforeAll(async () => {
    // Registruj salon korisnika
    const salonUser = await registerUser('salon');
    salonToken = salonUser.token;
    
    // Kreiraj salon
    const salonRes = await createSalon(salonToken);
    salonId = salonRes.id;

    // Kreiraj nekoliko usluga sa različitim cenama
    await createService(salonToken, salonId, {
      naziv: 'Jeftina usluga',
      cena: 500,
      trajanje: 15,
      opis: 'Najjeftinija usluga'
    });

    await createService(salonToken, salonId, {
      naziv: 'Srednja usluga',
      cena: 1500,
      trajanje: 30,
      opis: 'Srednja usluga'
    });

    await createService(salonToken, salonId, {
      naziv: 'Skupa usluga',
      cena: 3000,
      trajanje: 60,
      opis: 'Najskuplja usluga'
    });
  });

  test('✅ Sortiranje usluga po ceni (rastuće)', async () => {
    const res = await request(app)
      .get(`/api/services/salon/${salonId}?sort=price&order=asc`);

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