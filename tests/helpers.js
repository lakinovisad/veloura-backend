// tests/helpers.js
const request = require('supertest');
const { app } = require('../server');
const fs = require('fs');

// Kreiraj logs direktorijum ako ne postoji
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

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
  
  if (res.body.success && res.body.data && res.body.data.salon) {
    return res.body.data.salon;
  } else if (res.body.salon) {
    return res.body.salon;
  } else {
    console.error('Unexpected salon creation response:', res.body);
    throw new Error('Failed to create salon');
  }
}

async function createService(token, salon_id, options = {}) {
  const res = await request(app)
    .post('/api/services')
    .set('Authorization', `Bearer ${token}`)
    .send({
      naziv: options.naziv || `Usluga ${Date.now()}`,
      cena: options.cena || 1000,
      trajanje: options.trajanje || 30,
      opis: options.opis || 'Test usluga',
      salon_id: salon_id
    });
  
  if (res.body.success && res.body.data && res.body.data.service) {
    return res.body.data.service;
  } else if (res.body.service) {
    return res.body.service;
  } else {
    console.error('Unexpected service creation response:', res.body);
    throw new Error('Failed to create service');
  }
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
  
  if (res.body.success && res.body.data && res.body.data.appointment) {
    return res.body.data.appointment;
  } else if (res.body.appointment) {
    return res.body.appointment;
  } else {
    console.error('Unexpected appointment creation response:', res.body);
    throw new Error('Failed to create appointment');
  }
}

// Helper functions for test setup
async function createTestUser({ role = 'klijent' }) {
  const res = await request(app).post('/api/auth/register').send({
    name: `Test-${role}-${Date.now()}`,
    email: `test-${role}-${Date.now()}@example.com`,
    password: 'lozinka123',
    role,
    phone: '+381601234567'
  });
  return res.body.user;
}

async function createTestSalon({ owner_id }) {
  const res = await request(app)
    .post('/api/salons')
    .set('Authorization', `Bearer ${owner_id}`)
    .send({
      naziv: `Test Salon ${Date.now()}`,
      lokacija: 'Test adresa',
      opis: 'Test opis',
      radno_vreme: '09:00-17:00'
    });
  return res.body.data?.salon || res.body.salon;
}

async function createTestService({ salon_id }) {
  const res = await request(app)
    .post('/api/services')
    .set('Authorization', `Bearer ${salon_id}`)
    .send({
      naziv: `Test Usluga ${Date.now()}`,
      cena: 1000,
      trajanje: 30,
      opis: 'Test usluga'
    });
  return res.body.data?.service || res.body.service;
}

async function createTestAppointment(token, salon_id, service_id) {
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

async function clearDatabase() {
  const { db } = require('../db');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM Reviews', (err) => {
        if (err) reject(err);
        else {
          db.run('DELETE FROM Appointments', (err) => {
            if (err) reject(err);
            else {
              db.run('DELETE FROM Services', (err) => {
                if (err) reject(err);
                else {
                  db.run('DELETE FROM Salons', (err) => {
                    if (err) reject(err);
                    else {
                      db.run('DELETE FROM Users', (err) => {
                        if (err) reject(err);
                        else resolve();
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
}

function generateToken(user) {
  const jwt = require('jsonwebtoken');
  
  if (!user || !user.id) {
    console.error('Invalid user object for token generation:', user);
    throw new Error('User object must have an id property');
  }
  
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
}

module.exports = {
  registerUser,
  loginUser,
  createSalon,
  createService,
  createAppointment,
  createTestUser,
  createTestSalon,
  createTestService,
  createTestAppointment,
  clearDatabase,
  generateToken
}; 