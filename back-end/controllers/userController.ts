import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Position } from '../entities/Position';
import sharp from 'sharp';
import dotenv from 'dotenv';
import tinify from 'tinify';
import fs from 'fs';
import path from 'path';
dotenv.config();

const userRepository = AppDataSource.getRepository(User);
const positionRepository = AppDataSource.getRepository(Position);
tinify.key = process.env.TINYPNG_API_KEY as string;

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const { count = 6, page = 1 } = req.query;
    const take = parseInt(count as string);
    const skip = (parseInt(page as string) - 1) * take;

    try {
        const [users, total] = await userRepository.findAndCount({
            take,
            skip,
            order: { id: 'ASC' },
        });

        const totalPages = Math.ceil(total / take);
        const nextPage = parseInt(page as string) < totalPages ? parseInt(page as string) + 1 : null;
        const prevPage = parseInt(page as string) > 1 ? parseInt(page as string) - 1 : null;

        res.status(200).json({
            success: true,
            page: parseInt(page as string),
            total_pages: totalPages,
            total_users: total,
            count: take,
            links: {
                next_url: nextPage ? `/users?count=${count}&page=${nextPage}` : null,
                prev_url: prevPage ? `/users?count=${count}&page=${prevPage}` : null
            },
            users,
        });
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        if (user) {
            res.status(200).json({success: true, user});
        } else {
            res.status(404).json({success: false, message: "User not found"});
        }
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, position_id } = req.body;
    const photo = req.file;

    try {

        if (!photo) {
            res.status(400).json({ success: false, message: 'Photo is required' });
            return;
        }

        if (typeof name !== 'string' || name.length < 2 || name.length > 60) {
            res.status(400).json({ success: false, message: 'Name must be between 2 and 60 characters' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ success: false, message: 'Invalid email format' });
            return;
        }

        const phoneRegex = /^\+380\d{9}$/;
        if (!phoneRegex.test(phone)) {
            res.status(400).json({ success: false, message: 'Phone number must start with +380 and contain 12 digits' });
            return;
        }

        const position = await positionRepository.findOneBy({ id: parseInt(position_id) });
        if (!position) {
            res.status(400).json({ success: false, message: 'Invalid position_id' });
            return;
        }
        const buffer = photo.buffer;

        const imageMetadata = await sharp(buffer).metadata();
        if (imageMetadata.width as number < 70 || imageMetadata.height as number < 70) {
            res.status(400).json({ success: false, message: 'Photo resolution must be at least 70x70px' });
            return;
        }

        if (photo.mimetype !== 'image/jpeg' && photo.mimetype !== 'image/jpg') {
            res.status(400).json({ success: false, message: 'Photo must be a JPG/JPEG image' });
            return;
        }
        if (photo.size > 5 * 1024 * 1024) {
            res.status(400).json({ success: false, message: 'Photo size must not exceed 5MB' });
            return;
        }

        const optimizedImageBuffer = await tinify.fromBuffer(buffer)
            .resize({ method: 'cover', width: 70, height: 70 })
            .toBuffer().catch(error => {
                console.error('Error optimizing image with TinyPNG:', error);
                throw new Error('TinyPNG optimization failed');
            });

        const fileName = `user_${Date.now()}.jpg`;
        const filePath = path.join(__dirname, '..', '../images/users', fileName);

        fs.writeFileSync(filePath, optimizedImageBuffer);

        const photoUrl = `${process.env.API_URL}/api/uploads/${fileName}`;

        const existingUser = await userRepository.findOne({
            where: [
                { email },
                { phone }
            ]
        });

        if (existingUser) {
            res.status(400).json({ success: false, message: 'User with this phone or email already exist' });
            return;
        }

        const newUser = userRepository.create({
            name,
            email,
            phone,
            position_id,
            photo: photoUrl
        });

        await userRepository.save(newUser);

        res.status(200).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};
