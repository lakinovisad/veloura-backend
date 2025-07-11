const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

class Appointment {
  // Kreiraj novi termin
  static async create(data) {
    const { user_id, salon_id, service_id, datum, vreme, status } = data;
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO Appointments (id, user_id, salon_id, service_id, datum, vreme, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [id, user_id, salon_id, service_id, datum, vreme, status || 'zakazano'], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, user_id, salon_id, service_id, datum, vreme, status: status || 'zakazano' });
        }
      });
    });
  }

  // Dohvati sve termine za korisnika
  static findByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Appointments WHERE user_id = ? ORDER BY datum DESC, vreme DESC', [user_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Dohvati sve termine za salon
  static findBySalonId(salon_id) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Appointments WHERE salon_id = ? ORDER BY datum DESC, vreme DESC', [salon_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Pronađi termin po ID-u
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Appointments WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Ažuriraj status termina
  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE Appointments SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) reject(err);
        else resolve({ id, status });
      });
    });
  }
}

module.exports = Appointment; 