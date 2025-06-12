const db = require('./db');

module.exports = {
  async getAll() {
    const [rows] = await db.query(`
      SELECT a.*, p.name AS patient_name, d.name AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC
    `);
    return rows;
  },
  async getById(id) {
    const [rows] = await db.query(`
      SELECT a.*, p.name AS patient_name, d.name AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `, [id]);
    return rows[0];
  },
  async create(appointment) {
    const { patient_id, doctor_id, appointment_date, notes } = appointment;
    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, notes) VALUES (?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, notes]
    );
    return { id: result.insertId, ...appointment };
  },
  async update(id, appointment) {
    const { patient_id, doctor_id, appointment_date, notes } = appointment;
    await db.query(
      'UPDATE appointments SET patient_id=?, doctor_id=?, appointment_date=?, notes=? WHERE id=?',
      [patient_id, doctor_id, appointment_date, notes, id]
    );
    return { id, ...appointment };
  },
  async delete(id) {
    await db.query('DELETE FROM appointments WHERE id=?', [id]);
    return { id };
  }
};
