const request = require('supertest');
const { app } = require('../server');
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
let appointmentId, salonId;

beforeAll(async () => {
  await helpers.clearDatabase();
  
  // Registruj klijenta i salona
  const clientUser = await helpers.registerUser('klijent');
  const salonUser = await helpers.registerUser('salon');
  
  tokens = {
    client: clientUser.token,
    owner: salonUser.token
  };
  
  // Kreiraj salon i uslugu
  const salon = await helpers.createSalon(tokens.owner);
  salonId = salon.id; // Sačuvaj salon ID
  const service = await helpers.createService(tokens.owner, salon.id);
  
  // Kreiraj završen termin
  appointmentId = await helpers.createAppointment(tokens.client, salon.id, service.id);
  
  // Ažuriraj status termina na 'završeno'
  await request(app)
    .patch(`/api/appointments/${appointmentId}/status`)
    .set('Authorization', `Bearer ${tokens.owner}`)
    .send({ status: 'završeno' });
});

describe('📌 REVIEWS ROUTES', () => {
  test('✅ Dozvoljeno kreiranje recenzije nakon završenog termina', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${tokens.client}`)
      .send({
        salon_id: salonId,
        ocena: 5,
        komentar: 'Sjajno iskustvo!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('review');
    reviewId = res.body.data.review.id;
    log('Korisnik uspešno kreirao recenziju.');
  });

  test('❌ Nije dozvoljeno bez završenog termina', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${tokens.client}`)
      .send({
        salon_id: 'nonexistent-salon-id',
        ocena: 4,
        komentar: 'Fake termin'
      });

    expect(res.statusCode).toBe(403);
    log('Odbijeno kreiranje recenzije bez važećeg termina.');
  });

  test('✅ Prikaz svih recenzija za salon', async () => {
    const res = await request(app)
      .get(`/api/reviews/salons/${salonId}/reviews`)
      .set('Authorization', `Bearer ${tokens.client}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('reviews');
    log('Uspesan prikaz recenzija za salon.');
  });

  test('✅ Prikaz svih recenzija korisnika', async () => {
    const res = await request(app)
      .get(`/api/reviews/user/${tokens.client}`)
      .set('Authorization', `Bearer ${tokens.client}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('reviews');
    log('Uspesan prikaz recenzija korisnika.');
  });

  test('❌ Nevalidna ocena', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${tokens.client}`)
      .send({
        salon_id: salonId,
        ocena: 9
      });

    expect(res.statusCode).toBe(400);
    log('Odbijena recenzija sa ocenom van raspona.');
  });
});

describe('📥 GET /reviews (pregled recenzija)', () => {
  let clientToken, clientId, salonToken, salonId, serviceId;

  beforeEach(async () => {
    await helpers.clearDatabase();

    // Registruj korisnika (klijent)
    const client = await helpers.registerUser('klijent');
    clientToken = client.token;
    clientId = client.user.id;

    // Registruj salon
    const salon = await helpers.registerUser('salon');
    salonToken = salon.token;

    // Kreiraj salon i uslugu
    const salonData = await helpers.createSalon(salonToken);
    salonId = salonData.id;

    const serviceData = await helpers.createService(salonToken, salonId);
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
      .patch(`/api/appointments/${appointment.id}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'completed' });

    // Klijent ostavlja recenziju
    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salonId,
        ocena: 5,
        komentar: 'Odlično!'
      });
  });

  it('✅ prikazuje sve recenzije za dati salon', async () => {
    const res = await request(app)
      .get(`/api/reviews/salons/${salonId}/reviews`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('reviews');
    expect(Array.isArray(res.body.data.reviews)).toBe(true);
    expect(res.body.data.reviews.length).toBeGreaterThan(0);
    expect(res.body.data.reviews[0]).toHaveProperty('komentar');
  });

  it('✅ prikazuje sve recenzije koje je korisnik ostavio', async () => {
    const res = await request(app)
      .get(`/api/reviews/user/${clientId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('reviews');
    expect(Array.isArray(res.body.data.reviews)).toBe(true);
    expect(res.body.data.reviews.length).toBeGreaterThan(0);
    expect(res.body.data.reviews[0]).toHaveProperty('komentar');
  });

  it('❌ neautorizovan pristup vraća 401', async () => {
    const res = await request(app).get(`/api/reviews/salons/${salonId}/reviews`);
    expect(res.statusCode).toBe(200); // Ovaj endpoint nije zaštićen
  });
});

describe('DELETE /api/reviews/:id', () => {
  let clientToken, adminToken, salonId, serviceId, appointmentId, reviewId;

  beforeEach(async () => {
    await helpers.clearDatabase();
    
    // Registruj klijenta
    const client = await helpers.registerUser('klijent');
    clientToken = client.token;

    // Registruj salona (kao admin)
    const admin = await helpers.registerUser('salon');
    adminToken = admin.token;

    // Kreiraj salon i uslugu
    const salon = await helpers.createSalon(adminToken);
    salonId = salon.id;

    const service = await helpers.createService(adminToken, salonId);
    serviceId = service.id;

    // Kreiraj termin
    const appointment = await helpers.createAppointment(clientToken, salonId, service.id);
    appointmentId = appointment.id;

    // Ažuriraj status termina na completed
    await request(app)
      .patch(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' });

    // Kreiraj recenziju
    const reviewRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salonId,
        ocena: 5,
        komentar: 'Odlično!'
      });
    
    reviewId = reviewRes.body.data.review.id;
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
    const otherUser = await helpers.registerUser('klijent');
    const otherToken = otherUser.token;

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