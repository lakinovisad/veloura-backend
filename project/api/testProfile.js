const axios = require('axios');

const token = "OVDE_UNESI_TVOJ_VALIDAN_TOKEN"; // ← zameni sa pravim tokenom

async function testProfileRoute() {
  try {
    const response = await axios.get('http://localhost:3001/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("✅ Uspešan odgovor:", response.status);
    console.log("📦 Podaci korisnika:", response.data.data.user);

    const user = response.data.data.user;

    if (user.id && user.name && user.email && user.role && 'phone' in user) {
      console.log("🎉 Svi potrebni podaci su prisutni.");
    } else {
      console.warn("⚠️ Neki podaci nedostaju u odgovoru.");
    }

  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data.message;

      console.error(`❌ Greska (${status}): ${msg}`);

      if (status === 401) {
        if (msg === 'Token je potreban za pristup' || msg === 'Neispravan token') {
          console.log("✅ Očekivana 401 greška potvrđena.");
        }
      }
    } else {
      console.error("❌ Neuspešna konekcija:", error.message);
    }
  }
}

testProfileRoute();
