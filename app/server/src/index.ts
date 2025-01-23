import cors from 'cors';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenv.config());
import express, { Request, Response } from 'express';
import { SeedService } from './services/SeedService';
import { prismaDBClient } from '../config/prisma';

// route
import { authRouter } from './routes/AuthRouter';

// Middleware

const seedService = new SeedService(prismaDBClient);

const init = async () => {
    const port = process.env.API_PORT ? +process.env.API_PORT : 5000;
    await seedService.seed();
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/public', express.static('uploads'))

    app.use('/auth', authRouter);

    app.get('/', (req: Request, res: Response) => {
        res.send('ok');
    })

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};

init()