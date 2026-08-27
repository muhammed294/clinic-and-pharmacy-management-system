const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'card_officer', 'doctor'), vitalsController.getAllVitals);
router.get('/:id', authorizeRoles('admin', 'card_officer', 'doctor'), vitalsController.getVitalsByID);
router.post('/', authorizeRoles('admin', 'card_officer'), vitalsController.createVitals);
router.put('/:id', authorizeRoles('admin', 'card_officer'), vitalsController.updateVitalsByID);
router.delete('/:id', authorizeRoles('admin'), vitalsController.deleteVitalsByID);

module.exports = router;