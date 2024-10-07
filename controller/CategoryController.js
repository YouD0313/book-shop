import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export const categoryAll = async (req, res, next) => {
	const [categoryAll] = await conn.query(`SELECT * FROM category`);
	res.status(StatusCodes.OK).json(categoryAll);
};

export const categoryEach = async (req, res, next) => {
	const { category_id } = req.params;
	const [categoryEach] = await conn.query(
		`SELECT * FROM category WHERE id='${category_id}'`
	);
	res.status(StatusCodes.OK).json(categoryEach[0]);
};
