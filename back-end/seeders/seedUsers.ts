import { faker } from '@faker-js/faker';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Position } from '../entities/Position';
import sharp from 'sharp';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

dotenv.config();

const seedUsers = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.query('TRUNCATE TABLE "user" CASCADE');
    await queryRunner.query('TRUNCATE TABLE "position" CASCADE');

    const positionRepository = AppDataSource.getRepository(Position);
    const userRepository = AppDataSource.getRepository(User);

    const positions = ['Lawyer', 'Content manager', 'Security', 'Designer'];
    const positionRecords = await Promise.all(
      positions.map(name => positionRepository.save(positionRepository.create({ name })))
    );

    for (let i = 0; i < 45; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const phone = '+380' + faker.string.numeric(9);
      const position = faker.helpers.arrayElement(positionRecords);

      const imageBuffer = await axios({ 
        url: faker.image.avatar(), 
        responseType: 'arraybuffer' 
      }).then(response => Buffer.from(response.data, 'binary'));

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize(70, 70, { fit: sharp.fit.cover })
        .jpeg({ quality: 80 })
        .toBuffer();
        
      const fileName = `user_${Date.now()}.jpg`;
      const filePath = path.join(__dirname, '..', '../images/users', fileName);
      fs.writeFileSync(filePath, resizedImageBuffer);

      const photo = `http://localhost:3001/api/uploads/${fileName}`;

      const user = userRepository.create({
        name,
        email,
        phone,
        position_id: position.id,
        photo,
      });
      await userRepository.save(user);
    }

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    process.exit();
  }
};

seedUsers();
