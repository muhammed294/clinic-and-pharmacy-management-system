const express = require('express');
const router = express.Router();
const labResultController = require('../controllers/labResultController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'doctor', 'lab_technician'), labResultController.getAllLabResult);
router.get('/:id', authorizeRoles('admin', 'doctor', 'lab_technician'), labResultController.getLabResultByID);
router.post('/', authorizeRoles('admin', 'lab_technician'), labResultController.createLabResult);
router.put('/:id', authorizeRoles('admin', 'lab_technician'), labResultController.updateLabResultByID);
router.delete('/:id', authorizeRoles('admin'), labResultController.deleteLabResultByID);

module.exports = router;