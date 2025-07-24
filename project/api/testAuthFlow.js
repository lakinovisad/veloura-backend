const axios = require('axios');

const apiBase = 'http://localhost:3001/api/auth';

const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'test1234',
  role: 'klijent'
};

async function testAuthFlow() {
  try {
    console.log('📨 Registrujem korisnika...');
    await axios.post(`${apiBase}/register`, testUser);
    console.log('✅ Registrovan uspešno (ili već postoji).');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('ℹ️ Korisnik verovatno već postoji. Nastavljamo...');
    } else {
      console.error('❌ Greška pri registraciji:', error.response?.data || error.message);
      return;
    }
  }

  try {
    console.log('🔐 Logujem korisnika...');
    const loginRes = await axios.post(`${apiBase}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    const token = loginRes.data.data.token;
    console.log('✅ Login uspešan!');

    console.log('👤 Testiram /profile sa tokenom...');
    const profileRes = await axios.get(`${apiBase}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Dobijen profil:', profileRes.data);
  } catch (error) {
    console.error('❌ Greška u auth flow:', error.response?.data || error.message);
  }
}

testAuthFlow();
