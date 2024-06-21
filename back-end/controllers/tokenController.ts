import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (req: Request, res: Response): void => {
    try {
        const token = jwt.sign({}, process.env.SECRET_KEY as string, { expiresIn: '40m' });
        res.json({ "success": true, token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate token' });
    }
};