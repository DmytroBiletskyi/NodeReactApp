import express from 'express';
import { generateToken } from '../controllers/tokenController';

const router = express.Router();

router.get('/', generateToken);

export default router;