import express from 'express';
import { login, register } from '../controllers/authController';
import { getClubs, getClubById } from '../controllers/clubController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/', getClubs);
router.get('/:id', getClubById);

export default router;