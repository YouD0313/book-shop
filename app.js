import express, { json } from 'express';
import { config } from 'dotenv';
config();

const app = express();
app.listen(process.env.PORT);
app.use(json());

import usersRouter from './routes/users.js';

app.use('/', usersRouter);
