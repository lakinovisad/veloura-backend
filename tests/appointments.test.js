const request = require('supertest');
const { app } = require('../server');
const { registerUser, loginUser, createSalon, createService, clearDatabase } = require('./helpers');
const fs = require('fs');

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const logFile = 'logs/test-log.txt';
const log = (message) => fs.appendFileSync(logFile, `${new Date().toISOString()} - ${message}\n`);

describe('🧪 Appointments API - POST', () => {
  let clientToken, salonToken, salonId, serviceId, clientUserId;

  beforeEach(async () => {
    await clearDatabase();

    // Registruj i prijavi klijenta
    const clientData = await registerUser('klijent');
    clientToken = clientData.token;
    clientUserId = clientData.user.id;

    // Registruj i prijavi salon
    const salonData = await registerUser('salon');
    salonToken = salonData.token;

    // Kreiraj salon
    const salon = await createSalon(salonToken);
    salonId = salon.id;

    // Kreiraj uslugu
    const service = await createService(salonToken, salonId);
    serviceId = service.id;
  });

  test('✅ Klijent uspešno zakazuje termin', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salonId,
        service_id: serviceId,
        datum: '2025-08-01',
        vreme: '12:00'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.appointment).toHaveProperty('id');
    log('✅ Klijent uspešno zakazao termin');
  });

  test('❌ Zakazivanje bez service_id treba da vrati 400', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salonId,
        datum: '2025-08-01',
        vreme: '12:00'
      });

    expect(res.statusCode).toBe(400);
    log('❌ Zakazivanje bez service_id vraća 400');
  });
});

describe('GET /appointments', () => {
  let clientToken, salonToken, salonId, serviceId, appointmentId, clientUserId;

  beforeEach(async () => {
    await clearDatabase();

    // Registruj i prijavi klijenta
    const clientData = await registerUser('klijent');
    clientToken = clientData.token;
    clientUserId = clientData.user.id;

    // Registruj i prijavi salon
    const salonData = await registerUser('salon');
    salonToken = salonData.token;

    // Kreiraj salon
    const salon = await createSalon(salonToken);
    salonId = salon.id;

    // Kreiraj uslugu
    const service = await createService(salonToken, salonId);
    serviceId = service.id;

    // Klijent zakazuje termin
    const appointmentRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salonId,
        service_id: serviceId,
        datum: '2025-08-01',
        vreme: '12:00'
      });
    appointmentId = appointmentRes.body.data.appointment.id;
  });

  test('✅ Klijent vidi svoje zakazane termine', async () => {
    const res = await request(app)
      .get(`/api/appointments/user/${clientUserId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.appointments)).toBe(true);
    expect(res.body.data.appointments.length).toBeGreaterThan(0);
    log('✅ Klijent uspešno dobija listu svojih termina');
  });

  test('✅ Salon vidi sve zakazane termine za svoj salon', async () => {
    const res = await request(app)
      .get(`/api/appointments/salon/${salonId}`)
      .set('Authorization', `Bearer ${salonToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.appointments)).toBe(true);
    expect(res.body.data.appointments.length).toBeGreaterThan(0);
    log('✅ Salon uspešno dobija sve zakazane termine');
  });

  test('❌ Neautorizovan pristup terminima', async () => {
    const res = await request(app).get(`/api/appointments/user/${clientUserId}`);
    expect(res.statusCode).toBe(401);
    log('❌ Neautorizovani korisnik ne može pristupiti terminima');
  });
});

describe('PUT /api/appointments/:id/status - Ažuriranje statusa termina', () => {
  let clientToken, salonToken, otherSalonToken, appointmentId;

  beforeEach(async () => {
    await clearDatabase();

    // Registruj i prijavi klijenta
    const clientData = await registerUser('klijent');
    clientToken = clientData.token;

    // Registruj i prijavi salon
    const salonData = await registerUser('salon');
    salonToken = salonData.token;

    // Registruj i prijavi drugi salon
    const otherSalonData = await registerUser('salon');
    otherSalonToken = otherSalonData.token;

    // Kreiraj salon
    const salon = await createSalon(salonToken);
    const service = await createService(salonToken, salon.id);

    // Klijent zakazuje termin
    const appointmentRes = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        salon_id: salon.id,
        service_id: service.id,
        datum: '2025-08-01',
        vreme: '12:00'
      });
    appointmentId = appointmentRes.body.data.appointment.id;
  });

  test('✅ Salon može ažurirati status svog termina', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'završeno' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Status termina uspešno ažuriran');
  });

  test('❌ Klijent ne može ažurirati status termina', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ status: 'otkazano' });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Nemate dozvolu/);
  });

  test('❌ Neautorizovan korisnik ne može ažurirati termin', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .send({ status: 'završeno' });

    expect(res.statusCode).toBe(401);
  });

  test('❌ Drugi salon ne može ažurirati tuđ termin', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${otherSalonToken}`)
      .send({ status: 'otkazano' });

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toMatch(/Nemate dozvolu/);
  });

  test('❌ Ažuriranje nepostojećeg termina vraća 404', async () => {
    const fakeId = '9999';
    const res = await request(app)
      .put(`/api/appointments/${fakeId}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({ status: 'završeno' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Termin nije pronađen/);
  });

  test('❌ Ažuriranje bez statusa vraća 400', async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}/status`)
      .set('Authorization', `Bearer ${salonToken}`)
      .send({}); // Nedostaje status

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Neispravan status/);
  });
}); 