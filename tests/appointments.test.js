const request = require('supertest');
const { app, startServer } = require('../server');
const { db, initDatabase } = require('../db');
const {
  registerUser,
  loginUser,
  createSalon,
  createService,
  createAppointment
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

describe('Appointments API', () => {
  let clientToken, salonToken, salonId, serviceId, appointmentId, clientUserId;

  beforeAll(async () => {
    // Registracija korisnika
    const clientRes = await registerUser('klijent');
    const salonRes = await registerUser('salon');

    // Login
    const clientLogin = await loginUser(clientRes.user.email, '123456');
    const salonLogin = await loginUser(salonRes.user.email, '123456');

    clientToken = clientLogin.token;
    salonToken = salonLogin.token;
    clientUserId = clientLogin.user.id;

    // Kreiranje salona i usluge
    const salon = await createSalon(salonToken);
    salonId = salon.id;

    const service = await createService(salonToken, salonId);
    serviceId = service.id;
  });

  test('Korisnik može da zakaže termin', async () => {
    const res = await createAppointment(clientToken, salonId, serviceId);
    appointmentId = res.id;

    expect(res).toHaveProperty('id');
    expect(res).toHaveProperty('datum');
    expect(res).toHaveProperty('vreme');
  });

  test('Neautentifikovan korisnik ne može da zakaže termin', async () => {
    const res = await request(app).post('/api/appointments').send({});
    expect(res.statusCode).toBe(401);
  });

  test('Salon korisnik ne može da zakaže termin', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ salon_id: salonId, service_id: serviceId, datum: '2025-12-12', vreme: '12:00' });

    expect(res.statusCode).toBe(403);
  });

  test('Zahtev bez obaveznih polja odbijen', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('Klijent može da vidi svoje termine', async () => {
    const res = await request(app)
      .get(`/api/appointments/user/${clientUserId}`)
      .set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('appointments');
    expect(Array.isArray(res.body.data.appointments)).toBe(true);
  });

  test('Salon može da vidi termine svog salona', async () => {
    const res = await request(app)
      .get(`/api/appointments/salon/${salonId}`)
      .set('Authorization', `Bearer ${salonToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('appointments');
    expect(Array.isArray(res.body.data.appointments)).toBe(true);
  });

  test('Drugi korisnik ne može da vidi tuđe termine', async () => {
    const otherClient = await registerUser('klijent');
    const otherLogin = await loginUser(otherClient.user.email, '123456');

    const res = await request(app)
      .get(`/api/appointments/user/${clientUserId}`)
      .set('Authorization', `Bearer ${otherLogin.token}`);

    expect(res.statusCode).toBe(403);
  });

  test('Neautentifikovan korisnik ne može da vidi termine salona', async () => {
    const res = await request(app).get(`/api/appointments/salon/${salonId}`);
    expect(res.statusCode).toBe(401);
  });

  test('Vlasnik salona može da ažurira status termina', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'završeno' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('status', 'završeno');
  });

  test('Klijent ne može da ažurira status termina', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ status: 'otkazano' });

    expect(res.statusCode).toBe(403);
  });

  test('Ažuriranje sa nepostojećim terminom vraća 404', async () => {
    const res = await request(app)
      .put('/api/appointments/9999/status')
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'završeno' });

    expect(res.statusCode).toBe(404);
  });

  test('Neispravan status vraća 400', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'pogresan' });

    expect(res.statusCode).toBe(400);
  });
}); 