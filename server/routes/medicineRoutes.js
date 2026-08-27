const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'pharmacist'), medicineController.getAllMedicines);
router.get('/:id', authorizeRoles('admin', 'pharmacist'), medicineController.getMedicineByID);
router.post('/', authorizeRoles('admin', 'pharmacist'), medicineController.createMedicine);
router.put('/:id', authorizeRoles('admin', 'pharmacist'), medicineController.updateMedicineByID);
router.delete('/:id', authorizeRoles('admin', 'pharmacist'), medicineController.deleteMedicineByID);

module.exports = router;