const db = require('../models/db');

// Add a visit record
exports.addVisit = async (req, res) => {
  try {
    const { patient_id, visit_date, diagnosis, treatment, notes } = req.body;
    const [result] = await db.query(
      'INSERT INTO visits (patient_id, visit_date, diagnosis, treatment, notes) VALUES (?, ?, ?, ?, ?)',
      [patient_id, visit_date, diagnosis, treatment, notes]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Get all visits for a patient
exports.getVisitsByPatient = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM visits WHERE patient_id = ?', [req.params.patient_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
