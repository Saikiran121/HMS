const db = require('../models/db');
const bcrypt = require('bcrypt');

// Register user (patient self-registration, auto-create patient record)
exports.register = async (req, res) => {
  try {
    const { username, password, role, name, age, gender, phone } = req.body;

    // Only support patient self-registration for now
    if (!username || !password || !role || role !== 'patient' || !name || !age || !gender || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create patient record
    const [patientResult] = await db.query(
      'INSERT INTO patients (name, age, gender, phone) VALUES (?, ?, ?, ?)',
      [name, age, gender, phone]
    );
    const patientId = patientResult.insertId;

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user record linked to new patient
    await db.query(
      'INSERT INTO users (username, password, role, linked_id) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, role, patientId]
    );

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      // Show the actual MySQL duplicate entry error for debugging
      res.status(400).json({ error: err.message });
    } else {
      console.error('Register error:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

// Login user and create session
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Save user info in session
    req.session.user = { id: user.id, role: user.role, linked_id: user.linked_id };
    res.json({ message: 'Logged in' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get current logged-in user
exports.getCurrentUser = (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Logout user and destroy session
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
};

// Middleware to protect routes
exports.requireLogin = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
};
