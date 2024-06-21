import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import { AppDataSource } from './config/database';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log(`Received ${req.method} request for '${req.url}'`);
//     next();
//   })

app.use('/api/uploads', express.static(path.join(__dirname, '../images/users')));

app.use('/api', routes);

AppDataSource.initialize()
    .then(() => {
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log('Database connection error: ', error));