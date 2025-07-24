const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

class Salon {
  // Kreiraj novi salon
  static async create(salonData) {
    const { user_id, naziv, lokacija, opis, radno_vreme } = salonData;
    const id = uuidv4();

    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO Salons (id, user_id, naziv, lokacija, opis, radno_vreme)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, user_id, naziv, lokacija, opis, radno_vreme], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, user_id, naziv, lokacija, opis, radno_vreme });
        }
      });
    });
  }

  // Pronađi salon po ID-u
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT s.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM Salons s
        JOIN Users u ON s.user_id = u.id
        WHERE s.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Pronađi salon po user_id
  static findByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Salons WHERE user_id = ?', [user_id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Dohvati sve salone
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT s.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM Salons s
        JOIN Users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Ažuriraj salon
  static update(id, updateData) {
    const { naziv, lokacija, opis, radno_vreme } = updateData;
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE Salons 
        SET naziv = ?, lokacija = ?, opis = ?, radno_vreme = ?
        WHERE id = ?
      `, [naziv, lokacija, opis, radno_vreme, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, naziv, lokacija, opis, radno_vreme });
        }
      });
    });
  }

  // Obriši salon
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM Salons WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: true });
        }
      });
    });
  }

  // Proveri da li korisnik već ima salon
  static async userHasSalon(user_id) {
    const salon = await this.findByUserId(user_id);
    return !!salon;
  }
}

module.exports = Salon; 