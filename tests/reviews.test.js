const request = require('supertest');
const app = require('../server');
const db = require('../db');
const helpers = require('./helpers');
const fs = require('fs');

const LOG_FILE = 'logs/test-log.txt';
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