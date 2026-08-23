const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

router.get('/', prescriptionController.getAllPrescription);
router.post('/', prescriptionController.createPrescription);
router.get('/:id', prescriptionController.getPrescriptionByID);
router.put('/:id', prescriptionController.updatePrescriptionByID);
router.delete('/:id', prescriptionController.deletePrescriptionByID);

module.exports = router;