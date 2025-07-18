const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { db } = require('./db');

async function seed() {
  try {
    // Obriši sve postojeće podatke
    db.serialize(() => {
      db.run("DELETE FROM Reviews");
      db.run("DELETE FROM Appointments");
      db.run("DELETE FROM Services");
      db.run("DELETE FROM Salons");
      db.run("DELETE FROM Users");
    });

    // Dodaj korisnike
    const adminId = uuidv4();
    const clientId = uuidv4();
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);

    db.run(`INSERT INTO Users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [adminId, 'Admin Zoran', 'admin@veloura.com', adminPassword, 'admin', '060111222']);

    db.run(`INSERT INTO Users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, ?, ?)`,
      [clientId, 'Klijent Mira', 'mira@veloura.com', clientPassword, 'klijent', '061333444']);

    // Dodaj salon
    const salonId = uuidv4();
    db.run(`INSERT INTO Salons (id, user_id, naziv, lokacija, opis, radno_vreme)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [salonId, adminId, 'Salon Zora', 'Novi Sad', 'Salon lepote i mira', '09:00-17:00']);

    // Dodaj uslugu
    const serviceId = uuidv4();
    db.run(`INSERT INTO Services (id, salon_id, naziv, cena, trajanje, opis)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [serviceId, salonId, 'Šišanje', 1200, 30, 'Kratko muško šišanje']);

    // Dodaj termin
    const appointmentId = uuidv4();
    db.run(`INSERT INTO Appointments (id, user_id, salon_id, service_id, datum, vreme, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [appointmentId, clientId, salonId, serviceId, '2025-07-20', '14:00', 'završen']);

    // Dodaj recenziju
    const reviewId = uuidv4();
    db.run(`INSERT INTO Reviews (id, user_id, salon_id, ocena, komentar)
            VALUES (?, ?, ?, ?, ?)`,
      [reviewId, clientId, salonId, 5, 'Savršena usluga i atmosfera!']);

    console.log('✅ Seed podaci uspešno ubačeni!');
  } catch (err) {
    console.error('❌ Greška prilikom punjenja baze:', err);
  }
}

seed(); 