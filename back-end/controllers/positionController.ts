import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Position } from '../entities/Position';

const positionRepository = AppDataSource.getRepository(Position);

export const getPositions = async (req: Request, res: Response): Promise<void> => {
    try {
        const positions = await positionRepository.find();
        res.status(200).json({success: true, positions});
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};