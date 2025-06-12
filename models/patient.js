const db = require('./db');

module.exports = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM patients');
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
    return rows[0];
  },
  async create(patient) {
    const { name, age, gender, address, phone } = patient;
    const [result] = await db.query(
      'INSERT INTO patients (name, age, gender, address, phone) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, address, phone]
    );
    return { id: result.insertId, ...patient };
  },
  async update(id, patient) {
    const { name, age, gender, address, phone } = patient;
    await db.query(
      'UPDATE patients SET name=?, age=?, gender=?, address=?, phone=? WHERE id=?',
      [name, age, gender, address, phone, id]
    );
    return { id, ...patient };
  },
  async delete(id) {
    await db.query('DELETE FROM patients WHERE id=?', [id]);
    return { id };
  }
};
