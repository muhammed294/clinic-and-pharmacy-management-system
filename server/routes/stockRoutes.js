const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.post('/', authorizeRoles('admin', 'pharmacist'), stockController.createNewStock);
router.get('/', authorizeRoles('admin', 'pharmacist'), stockController.getAllStocks);
router.get('/low', authorizeRoles('admin', 'pharmacist'), stockController.getAllLowStocks);
router.get('/:id', authorizeRoles('admin', 'pharmacist'), stockController.getAllStocksByID);
router.put('/:id', authorizeRoles('admin', 'pharmacist'), stockController.updateAllStocksByID);
router.delete('/:id', authorizeRoles('admin', 'pharmacist'), stockController.deleteAllStocksByID);

module.exports = router;