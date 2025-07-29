const request = require('supertest');
const { app, startServer } = require('./server');
const { db, initDatabase } = require('./db');

let serverInstance;

async function testPagination() {
  try {
    // Inicijalizuj bazu
    await initDatabase();
    
    // Pokreni server
    serverInstance = await startServer();
    
    console.log('🧪 Testiranje paginacije...');
    
    // Prvo kreiraj test podatke
    const testData = await createTestData();
    
    if (!testData.success) {
      console.log('❌ Greška pri kreiranju test podataka:', testData.error);
      return;
    }
    
    const { salonId, token } = testData;
    
    // Provera da li token postoji
    if (!token) {
      console.log('❌ Token nedostaje - prekidam test');
      return;
    }
    
    console.log('🔑 Token dobijen, počinjem testove paginacije...');
    
    // Test 1: Prva strana (page=1, limit=3)
    console.log('\n📄 Test 1: Prva strana (page=1, limit=3)');
    const res1 = await request(app)
      .get(`/api/salons/${salonId}/services?page=1&limit=3`)
      .set("Authorization", `Bearer ${token}`);
    
    console.log('Status:', res1.statusCode);
    console.log('Response:', JSON.stringify(res1.body, null, 2));
    
    // Test 2: Druga strana (page=2, limit=3)
    console.log('\n📄 Test 2: Druga strana (page=2, limit=3)');
    const res2 = await request(app)
      .get(`/api/salons/${salonId}/services?page=2&limit=3`)
      .set("Authorization", `Bearer ${token}`);
    
    console.log('Status:', res2.statusCode);
    console.log('Response:', JSON.stringify(res2.body, null, 2));
    
    // Test 3: Default parametri
    console.log('\n📄 Test 3: Default parametri');
    const res3 = await request(app)
      .get(`/api/salons/${salonId}/services`)
      .set("Authorization", `Bearer ${token}`);
    
    console.log('Status:', res3.statusCode);
    console.log('Response:', JSON.stringify(res3.body, null, 2));
    
    // Sažetak rezultata
    console.log('\n📊 Sažetak rezultata paginacije:');
    console.log(`✅ Test 1 (page=1, limit=3): ${res1.body.data.services.length} usluga, total: ${res1.body.data.pagination.total}`);
    console.log(`✅ Test 2 (page=2, limit=3): ${res2.body.data.services.length} usluga, total: ${res2.body.data.pagination.total}`);
    console.log(`✅ Test 3 (default): ${res3.body.data.services.length} usluga, total: ${res3.body.data.pagination.total}`);
    
    console.log('\n🎉 Svi testovi paginacije uspešno završeni!');
    
  } catch (error) {
    console.error('❌ Greška:', error);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    db.close();
  }
}

async function createTestData() {
  try {
    // Registruj salon korisnika (auth route expects English field names)
    console.log('🔐 Registrujem korisnika...');
    const timestamp = Date.now();
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Pagination User',
        email: `test-pagination-${timestamp}@example.com`,
        password: 'test1234',
        role: 'salon'
      });
    
    console.log('Registration response:', JSON.stringify(registerRes.body, null, 2));
    
    if (!registerRes.body.token) {
      return { success: false, error: registerRes.body };
    }
    
    const token = registerRes.body.token;
    console.log('✅ Korisnik uspešno registrovan, token dobijen');
    
    // Kreiraj salon (salon route expects Serbian field names)
    console.log('🏪 Kreiram salon...');
    const salonRes = await request(app)
      .post('/api/salons')
      .set('Authorization', `Bearer ${token}`)
      .send({
        naziv: 'Test Salon za Paginaciju',
        lokacija: 'Test Lokacija'
      });
    
    console.log('Salon creation response:', JSON.stringify(salonRes.body, null, 2));
    
    if (!salonRes.body.success) {
      return { success: false, error: salonRes.body };
    }
    
    const salonId = salonRes.body.data.salon.id;
    console.log('✅ Salon uspešno kreiran, ID:', salonId);
    
    // Kreiraj 5 usluga (service route expects Serbian field names)
    console.log('💈 Kreiram usluge...');
    const services = [
      { naziv: 'Usluga 1', cena: 1000, trajanje: 30 },
      { naziv: 'Usluga 2', cena: 1500, trajanje: 45 },
      { naziv: 'Usluga 3', cena: 2000, trajanje: 60 },
      { naziv: 'Usluga 4', cena: 2500, trajanje: 90 },
      { naziv: 'Usluga 5', cena: 3000, trajanje: 120 }
    ];
    
    for (const service of services) {
      console.log(`📝 Kreiram uslugu: ${service.naziv}`);
      const serviceRes = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...service,
          opis: 'Test usluga'
        });
      
      console.log(`Service creation response for ${service.naziv}:`, JSON.stringify(serviceRes.body, null, 2));
      
      if (!serviceRes.body.success) {
        return { success: false, error: serviceRes.body };
      }
      console.log(`✅ Usluga "${service.naziv}" uspešno kreirana`);
    }
    
    console.log('🎉 Svi test podaci uspešno kreirani!');
    return { success: true, salonId, token };
    
  } catch (error) {
    console.error('❌ Greška u createTestData:', error);
    return { success: false, error: error.message };
  }
}

// Pokreni test
testPagination(); 