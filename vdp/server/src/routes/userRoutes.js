import express from 'express';

const router = express.Router();
const userController = require('../controllers/userController');

// Define routes for user-related actions
router.get('/:id', userController.getUserProfile);
router.put('/:id', userController.updateUserProfile);
router.delete('/:id', userController.deleteUserProfile);

export default router;