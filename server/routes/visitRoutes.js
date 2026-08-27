const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'card_officer', 'doctor', 'lab_technician'), visitController.getAllVsits);
router.get('/:id', authorizeRoles('admin', 'card_officer', 'doctor', 'lab_technician'), visitController.getVisitByID);
router.post('/', authorizeRoles('admin', 'card_officer'), visitController.createVisit);
router.put('/:id', authorizeRoles('admin', 'card_officer', 'doctor'), visitController.updateVisitByID);
router.delete('/:id', authorizeRoles('admin'), visitController.deleteVisitByID);

module.exports = router;