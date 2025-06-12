const db = require('../models/db');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Search patients by name or phone
exports.searchPatients = async (req, res) => {
  try {
    const { q } = req.query;
    const [rows] = await db.query(
      'SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ?',
      [`%${q}%`, `%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Add a new patient (registration)
exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, address, phone } = req.body;
    if (!name || !age || !gender || !address || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const [result] = await db.query(
      'INSERT INTO patients (name, age, gender, address, phone) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, address, phone]
    );
    const [patientRows] = await db.query('SELECT * FROM patients WHERE id = ?', [result.insertId]);
    res.status(201).json(patientRows[0]);
  } catch (err) {
    console.error('Error in createPatient:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update a patient profile
exports.updatePatient = async (req, res) => {
  try {
    const { name, age, gender, address, phone } = req.body;
    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE patients SET name=?, age=?, gender=?, address=?, phone=? WHERE id=?',
      [name, age, gender, address, phone, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    const [patientRows] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);
    res.json(patientRows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Upload digital documents (ID, insurance, other)
exports.uploadDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    await db.query(
      'UPDATE patients SET id_document=?, insurance_document=?, other_document=? WHERE id=?',
      [
        files.id_document ? files.id_document[0].path : null,
        files.insurance_document ? files.insurance_document[0].path : null,
        files.other_document ? files.other_document[0].path : null,
        id
      ]
    );
    res.json({ message: 'Documents uploaded' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete a patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM patients WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
