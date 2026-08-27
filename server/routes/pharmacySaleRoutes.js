const express = require('express');
const router = express.Router();
const pharmacySaleController = require('../controllers/pharmacySaleController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'pharmacist'), pharmacySaleController.getAllPharmacySale);
router.get('/:id', authorizeRoles('admin', 'pharmacist'), pharmacySaleController.createPharmacySale);
router.post('/', authorizeRoles('admin', 'pharmacist'), pharmacySaleController.createPharmacySale);
router.put('/:id', authorizeRoles('admin', 'pharmacist'), pharmacySaleController.updatePharmacySaleByID);
router.delete('/:id', authorizeRoles('admin', 'pharmacist'), pharmacySaleController.deletePharmacySaleByID);

module.exports = router;