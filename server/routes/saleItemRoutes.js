const express = require('express');
const router = express.Router();
const saleItemController = require('../controllers/saleItemController');

router.post('/', saleItemController.createSaleItem);
router.get('/', saleItemController.getAllSaleItem);
router.get('/:id', saleItemController.getSaleItemByID);
router.put('/:id', saleItemController.updateSaleItemByID);
router.delete('/:id', saleItemController.deleteSaleItemByID);

module.exports = router;