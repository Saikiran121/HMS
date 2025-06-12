const db = require('./db');

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM doctors');
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [id]);
    return rows[0];
  },
  async create(doctor) {
    const { name, specialization, phone } = doctor;
    const [result] = await db.query(
      'INSERT INTO doctors (name, specialization, phone) VALUES (?, ?, ?)',
      [name, specialization, phone]
    );
    return { id: result.insertId, ...doctor };
  },
  async update(id, doctor) {
    const { name, specialization, phone } = doctor;
    await db.query(
      'UPDATE doctors SET name=?, specialization=?, phone=? WHERE id=?',
      [name, specialization, phone, id]
    );
    return { id, ...doctor };
  },
  async delete(id) {
    await db.query('DELETE FROM doctors WHERE id=?', [id]);
    return { id };
  }
};
