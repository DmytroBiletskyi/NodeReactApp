import express from 'express';
import userRoutes from './userRoutes';
import positionRoutes from './positionRoutes';
import tokenRoutes from './tokenRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/positions', positionRoutes);
router.use('/token', tokenRoutes);

export default router;