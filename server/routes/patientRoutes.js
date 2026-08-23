const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/', patientController.getAllPatients);
router.post('/', patientController.createPatient);
router.get('/:id', patientController.getPatientByID);
router.put('/:id', patientController.updatePatientByID);
router.delete('/:id', patientController.deletePatientByID);

module.exports = router;