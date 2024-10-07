import express, { json } from 'express';
import { config } from 'dotenv';
config();

const app = express();
app.listen(process.env.PORT);
app.use(json());

import usersRouter from './routes/users.js';
import booksRouter from './routes/books.js';
import categoryRouter from './routes/category.js';
import likesRouter from './routes/likes.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';

app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/category', categoryRouter);
app.use('/likes', likesRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
