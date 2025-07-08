const db = require('../db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  // Kreiraj novog korisnika
  static async create(userData) {
    const { name, email, password, role, phone } = userData;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO Users (id, name, email, password, role, phone)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, name, email, hashedPassword, role, phone], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, name, email, role, phone });
        }
      });
    });
  }

  // Pronađi korisnika po email-u
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Pronađi korisnika po ID-u
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Users WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Proveri da li email već postoji
  static async emailExists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  // Proveri lozinku
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Ažuriraj korisnika
  static update(id, updateData) {
    const { name, email, phone } = updateData;
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE Users 
        SET name = ?, email = ?, phone = ?
        WHERE id = ?
      `, [name, email, phone, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, name, email, phone });
        }
      });
    });
  }

  // Obriši korisnika
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM Users WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: true });
        }
      });
    });
  }

  // Dohvati sve korisnike (bez lozinki)
  static findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT id, name, email, role, phone, created_at FROM Users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = User; 