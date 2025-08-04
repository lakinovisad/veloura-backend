const request = require('supertest');
const app = require('../server');
const db = require('../db');
const helpers = require('./helpers');
const fs = require('fs');
const path = require('path');

const LOG_FILE = 'logs/test-log.txt';
const LOG_DIR = path.dirname(LOG_FILE);

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const log = msg => fs.appendFileSync(LOG_FILE, `[reviews] ${msg}\n`);

let tokens = {};
let reviewId;
let appointmentId;

beforeAll(async () => {
  await helpers.clearDatabase();
  tokens = await helpers.seedUsersAndGetTokens();
  const salon = await helpers.createSalon(tokens.owner);
  await helpers.createService(tokens.owner, salon.id);
  appointmentId = await helpers.createCompletedAppointment(tokens.client, salon.id);
});

describe('📌 REVIEWS ROUTES', () => {
  test('✅ Dozvoljeno kreiranje recenzije nakon završenog termina', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${tokens.client}`)
      .send({
        appointmentId,
        rating: 5,
        comment: 'Sjajno iskustvo!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    reviewId = res.body.id;
    log('Korisnik uspešno kreirao recenziju.');
  });

  test('❌ Nije dozvoljeno bez završenog termina', async () => {
    const salon = await helpers.createSalon(tokens.owner);
    const service = await helpers.createService(tokens.owner, salon.id);
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${tokens.client}`)
      .send({
        appointmentId: 'nonexistent-id',
        rating: 4,
        comment: 'Fake termin'
      });

    expect(res.statusCode).toBe(400);
    log('Odbijeno kreiranje recenzije bez važećeg termina.');
  });

  test('✅ Prikaz svih recenzija za salon', async () => {
    const res = await request(app)
      .get(`/api/reviews/salon/${helpers.lastSalonId}`)
      .set('Authorization', `Bearer ${tokens.client}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    log('Uspesan prikaz recenzija za salon.');
  });

  test('✅ Prikaz svih recenzija korisnika', async () => {
    const res = await request(app)
      .get('/api/reviews/user')
      .set('Authorization', `Bearer ${tokens.client}`);

    expect(res.statusCode).toBe(200);
    log('Uspesan prikaz recenzija korisnika.');
  });

  test('❌ Nevalidna ocena', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${tokens.client}`)
      .send({
        appointmentId,
        rating: 9
      });

    expect(res.statusCode).toBe(400);
    log('Odbijena recenzija sa ocenom van raspona.');
  });
});

describe('📥 GET /reviews (pregled recenzija)', () => {
  let clientToken, clientId, salonToken, salonId, serviceId;

  beforeEach(async () => {
    await clearDatabase();

    // Registruj korisnika (klijent)
    const client = await registerUser('klijent');
    clientToken = client.token;
    clientId = client.user.id;

    // Registruj salon
    const salon = await registerUser('salon');
    salonToken = salon.token;

    // Kreiraj salon i uslugu
    const salonData = await createSalon(salonToken);
    salonId = salonData.id;

    const serviceData = await createService(salonToken, salonId);
    serviceId = serviceData.id;

    // Klijent zakazuje i završava termin
    const appointmentRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salonId,
        service_id: serviceId,
        datum: '2025-08-01',
        vreme: '12:00'
      });

    const appointment = appointmentRes.body.data.appointment;

    await request(app)
      .put(`/api/appointments/${appointment.id}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'završeno' });

    // Klijent ostavlja recenziju
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        appointment_id: appointment.id,
        ocena: 5,
        komentar: 'Odlično!'
      });
  });

  it('✅ prikazuje sve recenzije za dati salon', async () => {
    const res = await request(app)
      .get(`/api/reviews/salon/${salonId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('komentar');
  });

  it('✅ prikazuje sve recenzije koje je korisnik ostavio', async () => {
    const res = await request(app)
      .get(`/api/reviews/user/${clientId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('komentar');
  });

  it('❌ neautorizovan pristup vraća 401', async () => {
    const res = await request(app).get(`/api/reviews/salon/${salonId}`);
    expect(res.statusCode).toBe(401);
  });
});

describe('DELETE /api/reviews/:id', () => {
  let clientToken, adminToken, salonId, serviceId, appointmentId, reviewId;

  beforeEach(async () => {
    const client = await registerUser({ role: 'client' });
    clientToken = await loginUser(client);

    const admin = await registerUser({ role: 'admin' });
    adminToken = await loginUser(admin);

    const salon = await createSalon(clientToken);
    salonId = salon.id;

    const service = await createService(clientToken, salonId);
    serviceId = service.id;

    const appointment = await createAppointment(clientToken, salonId, serviceId);
    appointmentId = appointment.id;

    await updateAppointmentStatus(clientToken, appointmentId, 'completed');

    const review = await createReview(clientToken, salonId, serviceId, appointmentId);
    reviewId = review.id;
  });

  it('dozvoljava vlasniku da obriše svoju recenziju', async () => {
    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Recenzija je obrisana.');
  });

  it('dozvoljava adminu da obriše tuđu recenziju', async () => {
    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Recenzija je obrisana.');
  });

  it('ne dozvoljava drugom korisniku da obriše tuđu recenziju', async () => {
    const otherUser = await registerUser({ role: 'client' });
    const otherToken = await loginUser(otherUser);

    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Nemate dozvolu da obrišete ovu recenziju.');
  });

  it('vraća 404 ako recenzija ne postoji', async () => {
    const res = await request(app)
      .delete(`/api/reviews/99999`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Recenzija nije pronađena.');
  });
}); 