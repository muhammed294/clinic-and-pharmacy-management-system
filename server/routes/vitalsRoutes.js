const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');

router.get('/', vitalsController.getAllVitals);
router.post('/', vitalsController.createVitals);
router.get('/:id', vitalsController.getVitalsByID);
router.put('/:id', vitalsController.updateVitalsByID);
router.delete('/:id', vitalsController.deleteVitalsByID);

module.exports = router;