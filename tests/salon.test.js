const request = require('supertest');
const { app, startServer } = require('../server');
const { db, initDatabase } = require('../db');
const { registerUser, loginUser, createSalon } = require('./helpers');

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

describe('Salon API', () => {
  let tokenSalon, tokenKlijent, salonId;

  beforeAll(async () => {
    const salonUser = await registerUser('salon');
    const klijentUser = await registerUser('klijent');

    const loginSalon = await loginUser(salonUser.user.email, '123456');
    const loginKlijent = await loginUser(klijentUser.user.email, '123456');

    tokenSalon = loginSalon.token;
    tokenKlijent = loginKlijent.token;

    const res = await createSalon(tokenSalon);
    salonId = res.id;
  });

  test('Kreiranje salona - uspešno', async () => {
    const newUser = await registerUser('salon');
    const login = await loginUser(newUser.user.email, '123456');
    const res = await createSalon(login.token);

    expect(res).toHaveProperty('id');
    expect(res.naziv).toContain('Salon');
  });

  test('Kreiranje salona bez tokena - odbijeno', async () => {
    const res = await request(app).post('/api/salons').send({
      naziv: 'Salon Test',
      lokacija: 'Adresa Test',
      opis: 'Test opis',
      radno_vreme: '09:00-17:00'
    });

    expect(res.statusCode).toBe(401);
  });

  test('Kreiranje salona sa klijent tokenom - odbijeno', async () => {
    const res = await request(app)
      .post('/api/salons')
      .set('Authorization', `Bearer ${tokenKlijent}`)
      .send({
        naziv: 'Salon Test',
        lokacija: 'Adresa Test',
        opis: 'Test opis',
        radno_vreme: '09:00-17:00'
      });

    expect(res.statusCode).toBe(403);
  });

  test('Pregled svih salona - javna ruta', async () => {
    const res = await request(app).get('/api/salons');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('salons');
    expect(Array.isArray(res.body.data.salons)).toBe(true);
  });

  test('Pregled jednog salona po ID-u - javna ruta', async () => {
    const res = await request(app).get(`/api/salons/${salonId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('salon');
    expect(res.body.data.salon.id).toBe(salonId);
  });

  test('Ažuriranje salona od strane vlasnika - uspešno', async () => {
    const res = await request(app)
      .put(`/api/salons/${salonId}`)
      .set('Authorization', `Bearer ${tokenSalon}`)
      .send({
        naziv: 'Salon Ažuriran',
        lokacija: 'Nova Adresa',
        opis: 'Ažuriran opis',
        radno_vreme: '08:00-18:00'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data.salon.naziv).toBe('Salon Ažuriran');
  });

  test('Brisanje salona od strane vlasnika - uspešno', async () => {
    const newUser = await registerUser('salon');
    const login = await loginUser(newUser.user.email, '123456');
    const newSalon = await createSalon(login.token);

    const res = await request(app)
      .delete(`/api/salons/${newSalon.id}`)
      .set('Authorization', `Bearer ${login.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });
}); 