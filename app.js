require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();

// --- CORS Configuration (update origin as needed) ---
app.use(cors({
  origin: 'http://localhost:3001', // React frontend URL
  credentials: true
}));

// --- Body Parser ---
app.use(express.json());

// --- Session Middleware ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS in production
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// --- Static Files (for uploads) ---
app.use('/uploads', express.static('uploads'));

// --- API Routes ---
app.use('/api/patients', require('./routes/patients'));
app.use('/api/visits', require('./routes/visits'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));

// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System API' });
});

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
