import { Router } from 'express';
import jwt from 'jsonwebtoken';
import conn from '../mariadb.js';
import { config } from 'dotenv';
import { query, body, validationResult, param } from 'express-validator';
import { likedAdd, likedDel } from '../controller/likeController.js';
import { StatusCodes } from 'http-status-codes';
config();

const router = Router();
const { sign, verify } = jwt;

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty()) return next();
	return res.status(StatusCodes.BAD_REQUEST).json(err);
};

router
	.route('/:book_id')
	// 좋아요 추가
	.post(
		[
			param('book_id').notEmpty().isInt(),
			body('user_id').notEmpty().isInt(),
			validation,
		],
		likedAdd
	)
	// 좋아요 삭제
	.delete(
		[
			param('book_id').notEmpty().isInt(),
			body('user_id').notEmpty().isInt(),
			validation,
		],
		likedDel
	);

export default router;
