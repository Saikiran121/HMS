const express = require('express');
const router = express.Router();
const controller = require('../controllers/visitsController');

router.post('/', controller.addVisit);
router.get('/patient/:patient_id', controller.getVisitsByPatient);

module.exports = router;
