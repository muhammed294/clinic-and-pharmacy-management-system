const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.get('/', medicineController.getAllMedicines);
router.post('/', medicineController.createMedicine);
router.get('/:id', medicineController.getMedicineByID);
router.put('/:id', medicineController.updateMedicineByID);
router.delete('/:id', medicineController.deleteMedicineByID);

module.exports = router;