const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.post('/', stockController.createNewStock);
router.get('/', stockController.getAllStocks);
router.get('/low', stockController.getAllLowStocks);
router.get('/:id', stockController.getAllStocksByID);
router.put('/:id', stockController.updateAllStocksByID);
router.delete('/:id', stockController.deleteAllStocksByID);

module.exports = router;