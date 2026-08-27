const express = require('express');
const router = express.Router();
const saleItemController = require('../controllers/saleItemController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.post('/', authorizeRoles('admin', 'pharmacist'), saleItemController.createSaleItem);
router.get('/', authorizeRoles('admin', 'pharmacist'), saleItemController.getAllSaleItem);
router.get('/:id', authorizeRoles('admin', 'pharmacist'), saleItemController.getSaleItemByID);
router.put('/:id', authorizeRoles('admin', 'pharmacist'), saleItemController.updateSaleItemByID);
router.delete('/:id', authorizeRoles('admin', 'pharmacist'), saleItemController.deleteSaleItemByID);

module.exports = router;