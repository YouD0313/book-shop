import { Router } from 'express';
import { config } from 'dotenv';
import { query, param, validationResult } from 'express-validator';
import {
	selectAll,
	selectCategory,
	selectEach,
} from '../controller/BookController.js';
config();
const router = Router();

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty) {
		return next();
	} else {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: `입력을 제대로 하셔야 합니다.` });
	}
};

router.get(
	'/',
	[
		query('limit').notEmpty().isInt(),
		query('currentPage').notEmpty().isInt(),
		query('category').notEmpty().isInt(),
		query('isNew').notEmpty().isBoolean(),
		validation,
	],
	(req, res, next) => {
		if (req.query.category || req.query.isNew) {
			// 카테고리별 도서조회 -쿼리스트링
			selectCategory(req, res, next);
		} else {
			// 전체도서조회
			selectAll(req, res, next);
		}
	}
);

// 개별도서조회
router.get(
	'/:book_id',
	[param('book_id').notEmpty().isInt(), validation],
	selectEach
);

export default router;
