const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

router.get('/', visitController.getAllVsits);
router.post('/', visitController.createVisit);
router.get('/:id', visitController.getVisitByID);
router.put('/:id', visitController.updateVisitByID);
router.delete('/:id', visitController.deleteVisitByID);

module.exports = router;