const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

class Service {
  // Kreiraj novu uslugu
  static async create(serviceData) {
    const { salon_id, naziv, cena, trajanje, opis } = serviceData;
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO Services (id, salon_id, naziv, cena, trajanje, opis)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, salon_id, naziv, cena, trajanje, opis || null], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, salon_id, naziv, cena, trajanje, opis });
        }
      });
    });
  }

  // Dohvati sve usluge za dati salon
  static findBySalonId(salon_id) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Services WHERE salon_id = ? ORDER BY created_at DESC', [salon_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Dohvati usluge za dati salon sa paginacijom
  static findBySalonIdPaginated(salon_id, page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit;
      
      // Prvo dohvati ukupan broj usluga
      db.get('SELECT COUNT(*) as total FROM Services WHERE salon_id = ?', [salon_id], (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        const total = countRow.total;
        
        // Zatim dohvati usluge sa paginacijom
        db.all(
          'SELECT * FROM Services WHERE salon_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', 
          [salon_id, limit, offset], 
          (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                services: rows,
                pagination: {
                  page: parseInt(page),
                  limit: parseInt(limit),
                  total,
                  totalPages: Math.ceil(total / limit),
                  hasNext: page * limit < total,
                  hasPrev: page > 1
                }
              });
            }
          }
        );
      });
    });
  }

  // Pronađi uslugu po ID-u
  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Services WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Ažuriraj uslugu
  static update(id, updateData) {
    const { naziv, cena, trajanje, opis } = updateData;
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE Services
        SET naziv = ?, cena = ?, trajanje = ?, opis = ?
        WHERE id = ?
      `, [naziv, cena, trajanje, opis || null, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, naziv, cena, trajanje, opis });
        }
      });
    });
  }

  // Obriši uslugu
  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM Services WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: true });
        }
      });
    });
  }
}

module.exports = Service; 