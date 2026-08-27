const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'card_officer', 'doctor', 'lab_technician'), patientController.getAllPatients);
router.get('/:id', authorizeRoles('admin', 'card_officer', 'doctor', 'lab_technician'), patientController.getPatientByID);
router.post('/', authorizeRoles('admin', 'card_officer'), patientController.createPatient);
router.put('/:id', authorizeRoles('admin', 'card_officer'), patientController.updatePatientByID);
router.delete('/:id', authorizeRoles('admin', 'card_officer'), patientController.deletePatientByID);

module.exports = router;