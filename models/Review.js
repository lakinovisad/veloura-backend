const db = require('../db');
const { v4: uuidv4 } = require('uuid');

class Review {
  // Kreiraj novu recenziju
  static async create(data) {
    const { user_id, salon_id, ocena, komentar } = data;
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO Reviews (id, user_id, salon_id, ocena, komentar)
        VALUES (?, ?, ?, ?, ?)
      `, [id, user_id, salon_id, ocena, komentar || null], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, user_id, salon_id, ocena, komentar });
        }
      });
    });
  }

  // Dohvati sve recenzije za salon
  static findBySalonId(salon_id) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, u.name as user_name, u.email as user_email
        FROM Reviews r
        JOIN Users u ON r.user_id = u.id
        WHERE r.salon_id = ?
        ORDER BY r.created_at DESC
      `, [salon_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Dohvati sve recenzije korisnika
  static findByUserId(user_id) {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, s.naziv as salon_naziv, s.lokacija as salon_lokacija
        FROM Reviews r
        JOIN Salons s ON r.salon_id = s.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `, [user_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Proveri da li korisnik ima završen tretman u salonu
  static async hasCompletedAppointment(user_id, salon_id) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM Appointments
        WHERE user_id = ? AND salon_id = ? AND status = 'završeno'
      `, [user_id, salon_id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count > 0);
      });
    });
  }

  // Proveri da li korisnik već ostavio recenziju za salon
  static async hasReviewed(user_id, salon_id) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count
        FROM Reviews
        WHERE user_id = ? AND salon_id = ?
      `, [user_id, salon_id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count > 0);
      });
    });
  }

  // Pronađi recenziju po ID-u
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Reviews WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Ažuriraj recenziju
  static update(id, updateData) {
    const { ocena, komentar } = updateData;
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE Reviews
        SET ocena = ?, komentar = ?
        WHERE id = ?
      `, [ocena, komentar || null, id], function(err) {
        if (err) reject(err);
        else resolve({ id, ocena, komentar });
      });
    });
  }

  // Obriši recenziju
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM Reviews WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve({ deleted: true });
      });
    });
  }
}

module.exports = Review; 