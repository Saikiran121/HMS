const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

// Session-based authentication middleware
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Public routes (if you want them public)
router.get('/', appointmentsController.getAllAppointments);
router.get('/:id', appointmentsController.getAppointmentById);

// Protected routes
router.post('/', requireLogin, appointmentsController.createAppointment);
router.put('/:id', requireLogin, appointmentsController.updateAppointment);
router.delete('/:id', requireLogin, appointmentsController.deleteAppointment);

// Patient books appointment (protected)
router.post('/book', requireLogin, appointmentsController.bookAppointment);

// Doctor views their appointments (protected)
router.get('/doctor', requireLogin, appointmentsController.getDoctorAppointments);

module.exports = router;
