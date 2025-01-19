import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const init = () => {
    const port = process.env.API_PORT ? +process.env.API_PORT : 5000;

    const app = express();
    app.get('/', (req: Request, res: Response) => {
        res.send('ok2222');
    })

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    })
};

init();