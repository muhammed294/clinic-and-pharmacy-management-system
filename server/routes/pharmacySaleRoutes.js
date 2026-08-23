const express = require('express');
const router = express.Router();
const PharmacySaleController = require('../controllers/pharmacySaleController');

router.post('/', PharmacySaleController.createPharmacySale);
router.get('/', PharmacySaleController.getAllPharmacySale);
router.get('/:id', PharmacySaleController.getPharmacySaleByID);
router.put('/:id', PharmacySaleController.updatePharmacySaleByID);
router.delete('/:id', PharmacySaleController.deletePharmacySaleByID);

module.exports = router;