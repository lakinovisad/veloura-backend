// tests/helpers.js
const request = require('supertest');
const { app } = require('../server');

async function registerUser(role = 'klijent') {
  const res = await request(app).post('/api/auth/register').send({
    name: `Test-${role}-${Date.now()}`,
    email: `test-${role}-${Date.now()}@example.com`,
    password: '123456',
    role,
    phone: '+381601234567'
  });
  return {
    token: res.body.token,
    user: res.body.user,
  };
}

async function loginUser(email, password = '123456') {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return {
    token: res.body.token,
    user: res.body.user,
  };
}

async function createSalon(token) {
  const res = await request(app)
    .post('/api/salons')
    .set('Authorization', `Bearer ${token}`)
    .send({
      naziv: `Salon ${Date.now()}`,
      lokacija: 'Test adresa',
      opis: 'Test opis',
      radno_vreme: '09:00-17:00'
    });
  return res.body.data?.salon || res.body.salon;
}

async function createService(token, salon_id) {
  const res = await request(app)
    .post('/api/services')
    .set('Authorization', `Bearer ${token}`)
    .send({
      naziv: `Usluga ${Date.now()}`,
      cena: 1000,
      trajanje: 30,
      opis: 'Test usluga'
    });
  return res.body.data?.service || res.body.service;
}

async function createAppointment(token, salon_id, service_id) {
  const res = await request(app)
    .post('/api/appointments')
    .set('Authorization', `Bearer ${token}`)
    .send({
      datum: '2025-08-01',
      vreme: '12:00',
      salon_id,
      service_id
    });
  return res.body.data?.appointment || res.body.appointment;
}

module.exports = {
  registerUser,
  loginUser,
  createSalon,
  createService,
  createAppointment
}; 