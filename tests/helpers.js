// tests/helpers.js
const request = require('supertest');
const { app } = require('../server');
const fs = require('fs');

// Kreiraj logs direktorijum ako ne postoji
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

async function registerUser(role = 'klijent') {
  try {
    const userData = {
      name: `Test-${role}-${Date.now()}`,
      email: `test-${role}-${Date.now()}@example.com`,
      password: '123456',
      role,
      phone: '+381601234567'
    };
    
    console.log(`🔐 Registrujem korisnika: ${userData.email} sa rolom: ${role}`);
    
    const res = await request(app).post('/api/auth/register').send(userData);
    
    console.log("📤 REGISTRUJEM korisnika:", role);
    console.log("📥 TOKEN koji dobijam:", res.body.token);
    console.log("📋 RESPONSE BODY:", res.body);
    console.log(`📋 Registration response status: ${res.statusCode}`);
    console.log(`📋 Registration response body:`, JSON.stringify(res.body, null, 2));
    
    if (res.statusCode !== 201 && res.statusCode !== 200) {
      throw new Error(`Registration failed with status ${res.statusCode}: ${JSON.stringify(res.body)}`);
    }
    
    if (!res.body.token) {
      throw new Error(`No token received: ${JSON.stringify(res.body)}`);
    }
    
    console.log(`✅ Korisnik uspešno registrovan: ${userData.email}`);
    
    return {
      token: res.body.token,
      user: res.body.user || res.body.data?.user,
    };
  } catch (error) {
    console.error(`❌ Greška pri registraciji korisnika sa rolom ${role}:`, error.message);
    throw error;
  }
}

async function loginUser(email, password = '123456') {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return {
    token: res.body.token,
    user: res.body.user,
  };
}

async function createSalon(token) {
  try {
    const salonData = {
      naziv: `Salon ${Date.now()}`,
      lokacija: 'Test adresa',
      opis: 'Test opis',
      radno_vreme: '09:00-17:00'
    };
    
    console.log(`🏪 Kreiram salon: ${salonData.naziv}`);
    console.log(`🔑 Koristim token: ${token ? token.substring(0, 20) + '...' : 'NEMA TOKENA'}`);
    
    const res = await request(app)
      .post('/api/salons')
      .set('Authorization', `Bearer ${token}`)
      .send(salonData);
    
    console.log(`📋 Salon creation response status: ${res.statusCode}`);
    console.log(`📋 Salon creation response body:`, JSON.stringify(res.body, null, 2));
    
    if (res.statusCode !== 201 && res.statusCode !== 200) {
      throw new Error(`Salon creation failed with status ${res.statusCode}: ${JSON.stringify(res.body)}`);
    }
    
    if (res.body.success && res.body.data && res.body.data.salon) {
      console.log(`✅ Salon uspešno kreiran: ${res.body.data.salon.id}`);
      return res.body.data.salon;
    } else if (res.body.salon) {
      console.log(`✅ Salon uspešno kreiran: ${res.body.salon.id}`);
      return res.body.salon;
    } else {
      throw new Error(`Unexpected salon creation response: ${JSON.stringify(res.body)}`);
    }
  } catch (error) {
    console.error(`❌ Greška pri kreiranju salona:`, error.message);
    throw error;
  }
}

async function createService(token, salon_id, options = {}) {
  try {
    const serviceData = {
      naziv: options.naziv || `Usluga ${Date.now()}`,
      cena: options.cena || 1000,
      trajanje: options.trajanje || 30,
      opis: options.opis || 'Test usluga',
      salon_id: salon_id
    };
    
    console.log(`💈 Kreiram uslugu: ${serviceData.naziv} za salon: ${salon_id}`);
    console.log(`🔑 Koristim token: ${token ? token.substring(0, 20) + '...' : 'NEMA TOKENA'}`);
    
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send(serviceData);
    
    console.log(`📋 Service creation response status: ${res.statusCode}`);
    console.log(`📋 Service creation response body:`, JSON.stringify(res.body, null, 2));
    
    if (res.statusCode !== 201 && res.statusCode !== 200) {
      throw new Error(`Service creation failed with status ${res.statusCode}: ${JSON.stringify(res.body)}`);
    }
    
    if (res.body.success && res.body.data && res.body.data.service) {
      console.log(`✅ Usluga uspešno kreirana: ${res.body.data.service.id}`);
      return res.body.data.service;
    } else if (res.body.service) {
      console.log(`✅ Usluga uspešno kreirana: ${res.body.service.id}`);
      return res.body.service;
    } else {
      throw new Error(`Unexpected service creation response: ${JSON.stringify(res.body)}`);
    }
  } catch (error) {
    console.error(`❌ Greška pri kreiranju usluge:`, error.message);
    throw error;
  }
}

async function createAppointment(token, salon_id, service_id) {
  try {
    const appointmentData = {
      datum: '2025-08-01',
      vreme: '12:00',
      salon_id,
      service_id
    };
    
    console.log(`📅 Kreiram termin za salon: ${salon_id}, usluga: ${service_id}`);
    console.log(`🔑 Koristim token: ${token ? token.substring(0, 20) + '...' : 'NEMA TOKENA'}`);
    
    const res = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send(appointmentData);
    
    console.log(`📋 Appointment creation response status: ${res.statusCode}`);
    console.log(`📋 Appointment creation response body:`, JSON.stringify(res.body, null, 2));
    
    if (res.statusCode !== 201 && res.statusCode !== 200) {
      throw new Error(`Appointment creation failed with status ${res.statusCode}: ${JSON.stringify(res.body)}`);
    }
    
    if (res.body.success && res.body.data && res.body.data.appointment) {
      console.log(`✅ Termin uspešno kreiran: ${res.body.data.appointment.id}`);
      return res.body.data.appointment;
    } else if (res.body.appointment) {
      console.log(`✅ Termin uspešno kreiran: ${res.body.appointment.id}`);
      return res.body.appointment;
    } else {
      throw new Error(`Unexpected appointment creation response: ${JSON.stringify(res.body)}`);
    }
  } catch (error) {
    console.error(`❌ Greška pri kreiranju termina:`, error.message);
    throw error;
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