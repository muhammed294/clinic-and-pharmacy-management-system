const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/authorizeRoles');

router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);
router.post('/',authenticateToken, authorizeRoles('admin'), userController.createUser);
router.get('/:id', authenticateToken, authorizeRoles('admin'), userController.getUserByID);
router.put('/:id', authenticateToken, authorizeRoles('admin'), userController.updateUserByID);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUserByID);
router.post('/login', userController.loginUser);

module.exports = router;