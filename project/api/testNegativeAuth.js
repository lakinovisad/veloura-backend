const axios = require('axios');

const apiBase = 'http://localhost:3001/api/auth';

const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'test1234',
  role: 'klijent'
};

async function testNegativeAuth() {
  // 🔁 1. Dupla registracija
  try {
    console.log('\n🔁 Test 1: Dupla registracija...');
    const res = await axios.post(`${apiBase}/register`, testUser);
    console.log('❌ Neuspeh: Registracija je prošla, a očekivan je error.');
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('✅ Očekivani rezultat: registracija duplikata odbijena (409 Conflict).');
    } else if (error.response?.status === 400) {
      console.log('✅ Očekivani rezultat: registracija duplikata odbijena (400 Bad Request).');
    } else {
      console.error('❌ Neočekivana greška pri duploj registraciji:', error.message);
    }
  }

  // 🔑 2. Pogrešna lozinka
  try {
    console.log('\n🔑 Test 2: Login sa pogrešnom lozinkom...');
    const res = await axios.post(`${apiBase}/login`, {
      email: testUser.email,
      password: 'pogresnaLozinka'
    });
    console.log('❌ Neuspeh: Login je prošao sa pogrešnom lozinkom.');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Očekivani rezultat: login odbijen zbog pogrešne lozinke.');
    } else {
      console.error('❌ Neočekivana greška pri loginu:', error.message);
    }
  }

  // 🚫 3. Pristup /profile bez tokena
  try {
    console.log('\n🚫 Test 3: /profile bez tokena...');
    const res = await axios.get(`${apiBase}/profile`);
    console.log('❌ Neuspeh: Pristup bez tokena je prošao.');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Očekivani rezultat: pristup bez tokena odbijen.');
    } else {
      console.error('❌ Neočekivana greška bez tokena:', error.message);
    }
  }

  // 💥 4. Pristup /profile sa nevažećim tokenom
  try {
    console.log('\n💥 Test 4: /profile sa nevažećim tokenom...');
    const res = await axios.get(`${apiBase}/profile`, {
      headers: {
        Authorization: 'Bearer invalidtoken123'
      }
    });
    console.log('❌ Neuspeh: Pristup sa lošim tokenom je prošao.');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Očekivani rezultat: pristup sa lošim tokenom odbijen.');
    } else {
      console.error('❌ Neočekivana greška sa lošim tokenom:', error.message);
    }
  }

  console.log('\n✅ Svi negativni testovi izvršeni!');
}

testNegativeAuth();
