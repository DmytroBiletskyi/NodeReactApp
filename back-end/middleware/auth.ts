import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req: Request, res: Response, next: NextFunction): void => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).send('Authorization header missing');
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, process.env.SECRET_KEY as string);
        next();
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};

export default auth;