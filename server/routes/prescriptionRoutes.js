const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'doctor'), prescriptionController.getAllPrescription);
router.get('/:id', authorizeRoles('admin', 'doctor'), prescriptionController.getPrescriptionByID);
router.post('/', authorizeRoles('admin', 'doctor'), prescriptionController.createPrescription);
router.put('/:id', authorizeRoles('admin', 'doctor'), prescriptionController.updatePrescriptionByID);
router.delete('/:id', authorizeRoles('admin', 'doctor'), prescriptionController.deletePrescriptionByID);

module.exports = router;