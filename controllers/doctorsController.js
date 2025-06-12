const db = require('../models/db');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors');
    res.json(rows);
  } catch (err) {
    console.error('Error in getAllDoctors:', err.stack || err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error in getDoctorById:', err.stack || err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Add a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, gender, address, contact_no, email, specialist, degree } = req.body;
    if (!name || !gender || !address || !contact_no) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [result] = await db.query(
      'INSERT INTO doctors (name, gender, address, contact_no, email, specialist, degree) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, gender, address, contact_no, email, specialist, degree]
    );
    const [doctorRows] = await db.query('SELECT * FROM doctors WHERE id = ?', [result.insertId]);
    res.status(201).json(doctorRows[0]);
  } catch (err) {
    console.error('Error in createDoctor:', err.stack || err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Update a doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { name, gender, address, contact_no, email, specialist, degree } = req.body;
    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE doctors SET name=?, gender=?, address=?, contact_no=?, email=?, specialist=?, degree=? WHERE id=?',
      [name, gender, address, contact_no, email, specialist, degree, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Doctor not found' });
    const [doctorRows] = await db.query('SELECT * FROM doctors WHERE id = ?', [id]);
    res.json(doctorRows[0]);
  } catch (err) {
    console.error('Error in updateDoctor:', err.stack || err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM doctors WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    console.error('Error in deleteDoctor:', err.stack || err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};
