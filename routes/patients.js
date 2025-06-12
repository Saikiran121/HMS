const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientsController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', controller.createPatient);
router.get('/search', controller.searchPatients);
router.get('/:id', controller.getPatientById);
router.get('/', controller.getAllPatients);
router.put('/:id', controller.updatePatient);
router.post('/upload/:id', upload.fields([
  { name: 'id_document', maxCount: 1 },
  { name: 'insurance_document', maxCount: 1 },
  { name: 'other_document', maxCount: 1 }
]), controller.uploadDocuments);

module.exports = router;
