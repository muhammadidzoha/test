import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { SeedService } from './services/SeedService';
import { prismaDBClient } from '../config/prisma';

// route
import { authRouter } from './routes/AuthRouter';

dotenv.config();
const seedService = new SeedService(prismaDBClient);

const init = async () => {
    const port = process.env.API_PORT ? +process.env.API_PORT : 5000;
    console.log(process.env.API_PORT);
    console.log(process.env.DB_HOST);
    await seedService.seed();
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/auth', authRouter);

    app.get('/', (req: Request, res: Response) => {
        res.send('ok');
    })

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};

init()