const request = require('supertest');
const { app, startServer } = require('../server');
const { db, initDatabase } = require('../db');
const { registerUser, loginUser } = require('./helpers');

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

describe('🛡️ Auth testovi - Registracija i Login', () => {
  let korisnikEmail = '';
  let korisnikLozinka = '123456'; // helper koristi ovu lozinku

  // 1. ✅ Uspešna registracija klijenta
  test('✅ Registracija klijenta uspešna', async () => {
    const res = await registerUser('klijent');
    expect(res.token).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.role).toBe('klijent');
    korisnikEmail = res.user.email;
  });

  // 2. ✅ Uspešna registracija salona
  test('✅ Registracija salona uspešna', async () => {
    const res = await registerUser('salon');
    expect(res.token).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.role).toBe('salon');
  });

  // 3. ❌ Registracija bez lozinke
  test('❌ Registracija bez lozinke - 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test@example.com',
      role: 'klijent'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  // 4. ❌ Registracija sa pogrešnom ulogom
  test('❌ Registracija sa nepostojećom ulogom - 400', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Pogrešan',
      email: 'wrong@example.com',
      password: 'neka',
      role: 'admin' // nije dozvoljena
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  // 5. ✅ Uspešan login
  test('✅ Login uspešan', async () => {
    const res = await loginUser(korisnikEmail, korisnikLozinka);
    expect(res.token).toBeDefined();
    expect(res.user).toBeDefined();
    expect(res.user.email).toBe(korisnikEmail);
  });

  // 6. ❌ Login sa pogrešnom lozinkom
  test('❌ Login neuspešan - pogrešna lozinka', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: korisnikEmail,
      password: 'pogresna123'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  // 7. ❌ Login sa nepostojećim korisnikom
  test('❌ Login neuspešan - nepostojeći korisnik', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nepostoji@example.com',
      password: 'neka'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
}); 