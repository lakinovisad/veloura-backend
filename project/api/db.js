const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Kreiraj konekciju sa SQLite bazom
const dbPath = path.join(__dirname, 'veloura.db');
const db = new sqlite3.Database(dbPath);

// Inicijalizacija baze - kreiranje tabela
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // Kreiraj tabelu Users
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('klijent', 'salon')) NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Greška pri kreiranju tabele Users:', err);
        reject(err);
      } else {
        console.log('Tabela Users uspešno kreirana ili već postoji');
        
        // Kreiraj tabelu Salons
        db.run(`
          CREATE TABLE IF NOT EXISTS Salons (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            naziv TEXT NOT NULL,
            lokacija TEXT NOT NULL,
            opis TEXT,
            radno_vreme TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) {
            console.error('Greška pri kreiranju tabele Salons:', err);
            reject(err);
          } else {
            console.log('Tabela Salons uspešno kreirana ili već postoji');
            // Kreiraj tabelu Services
            db.run(`
              CREATE TABLE IF NOT EXISTS Services (
                id TEXT PRIMARY KEY,
                salon_id TEXT NOT NULL,
                naziv TEXT NOT NULL,
                cena REAL NOT NULL,
                trajanje INTEGER NOT NULL,
                opis TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (salon_id) REFERENCES Salons(id) ON DELETE CASCADE
              )
            `, (err) => {
              if (err) {
                console.error('Greška pri kreiranju tabele Services:', err);
                reject(err);
              } else {
                console.log('Tabela Services uspešno kreirana ili već postoji');
                // Kreiraj tabelu Appointments
                db.run(`
                  CREATE TABLE IF NOT EXISTS Appointments (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    salon_id TEXT NOT NULL,
                    service_id TEXT NOT NULL,
                    datum DATE NOT NULL,
                    vreme TEXT NOT NULL,
                    status TEXT CHECK(status IN ('zakazano', 'otkazano', 'završeno')) NOT NULL DEFAULT 'zakazano',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                    FOREIGN KEY (salon_id) REFERENCES Salons(id) ON DELETE CASCADE,
                    FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE
                  )
                `, (err) => {
                  if (err) {
                    console.error('Greška pri kreiranju tabele Appointments:', err);
                    reject(err);
                  } else {
                    console.log('Tabela Appointments uspešno kreirana ili već postoji');
                    // Kreiraj tabelu Reviews
                    db.run(`
                      CREATE TABLE IF NOT EXISTS Reviews (
                        id TEXT PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        salon_id TEXT NOT NULL,
                        ocena INTEGER CHECK(ocena >= 1 AND ocena <= 5) NOT NULL,
                        komentar TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
                        FOREIGN KEY (salon_id) REFERENCES Salons(id) ON DELETE CASCADE
                      )
                    `, (err) => {
                      if (err) {
                        console.error('Greška pri kreiranju tabele Reviews:', err);
                        reject(err);
                      } else {
                        console.log('Tabela Reviews uspešno kreirana ili već postoji');
                        resolve();
                      }
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
};

// Inicijalizuj bazu pri pokretanju
// initDatabase().catch(console.error);

module.exports = { db, initDatabase }; 