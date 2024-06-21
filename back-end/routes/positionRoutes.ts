import express from 'express';
import { getPositions } from '../controllers/positionController';
import auth from '../middleware/auth'

const router = express.Router();

router.get('/', auth, getPositions);

export default router;