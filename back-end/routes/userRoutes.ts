import express from 'express';
import { getUsers, getUserById, addUser } from '../controllers/userController';
import auth from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.post('/', auth, upload.single('photo'), addUser);

export default router;