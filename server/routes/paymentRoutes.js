const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authorizeRoles('admin', 'doctor', 'card_officer'), paymentController.getAllPayment);
router.get('/:id', authorizeRoles('admin', 'doctor', 'card_officer'), paymentController.getPaymentByID);
router.post('/', authorizeRoles('admin', 'card_officer'), paymentController.createPayment);
router.put('/:id', authorizeRoles('admin', 'card_officer'), paymentController.updatePaymentByID);
router.delete('/:id', authorizeRoles('admin'), paymentController.deletePaymentByID);

module.exports = router;