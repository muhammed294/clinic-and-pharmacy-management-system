const express = require('express');
const router = express.Router();
const lapRequestController = require('../controllers/labRequestController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'doctor', 'card_officer', 'lab_technician'), lapRequestController.getAllLabRequest);
router.get('/:id', authorizeRoles('admin', 'doctor', 'card_officer', 'lab_technician'), lapRequestController.getLabRequestByID);
router.post('/', authorizeRoles('admin', 'doctor'), lapRequestController.createLabRequest);
router.put('/:id', authorizeRoles('admin', 'card_officer', 'lab_technician'), lapRequestController.updateLabRequestByID);
router.delete('/:id', authorizeRoles('admin'), lapRequestController.deleteLabRequestByID);

module.exports = router;