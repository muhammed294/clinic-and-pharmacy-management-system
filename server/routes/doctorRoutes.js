const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', doctorController.getAllDoctors);
router.post('/', authorizeRoles('admin'), doctorController.createDoctor);
router.get('/:id', doctorController.getDoctorByID);
router.put('/:id', authorizeRoles('admin'), doctorController.updateDoctorByID);
router.delete('/:id', authorizeRoles('admin'), doctorController.deleteDoctorByID);

module.exports = router;