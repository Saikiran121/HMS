const db = require('../models/db');

// List all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query('SELECT * FROM appointments');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Get one appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const [appointments] = await db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
    if (appointments.length === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json(appointments[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_time } = req.body;
    if (!patient_id || !doctor_id || !appointment_time) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES (?, ?, ?)',
      [patient_id, doctor_id, appointment_time]
    );
    res.status(201).json({ message: 'Appointment created' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_time, status } = req.body;
    await db.query(
      'UPDATE appointments SET patient_id=?, doctor_id=?, appointment_time=?, status=? WHERE id=?',
      [patient_id, doctor_id, appointment_time, status, req.params.id]
    );
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    await db.query('DELETE FROM appointments WHERE id=?', [req.params.id]);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Patient books appointment (already implemented)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_time } = req.body;
    // Use session-based auth
    const patient_id = req.session.user.linked_id;

    if (!doctor_id || !appointment_time) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_time) VALUES (?, ?, ?)',
      [patient_id, doctor_id, appointment_time]
    );
    res.status(201).json({ message: 'Appointment booked' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// Doctor views appointments (already implemented)
exports.getDoctorAppointments = async (req, res) => {
  try {
    if (req.session.user.role !== 'doctor') return res.status(403).json({ error: 'Access denied' });

    const doctor_id = req.session.user.linked_id;
    const [appointments] = await db.query(
      `SELECT a.id, a.appointment_time, a.status, p.name AS patient_name, p.phone AS patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.doctor_id = ? AND a.status = 'scheduled'
       ORDER BY a.appointment_time ASC`,
      [doctor_id]
    );
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
