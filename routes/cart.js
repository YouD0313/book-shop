import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import {
	cartDelete,
	cartAdd,
	cartViewAll,
	cartViewSelect,
} from '../controller/cartController.js';
import { StatusCodes } from 'http-status-codes';

const router = Router();

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty()) {
		return next();
	}
	return res.status(StatusCodes.BAD_REQUEST).json(err);
};

router
	.route('/')
	// 장바구니 추가
	.post(
		[
			body('book_id').notEmpty().isInt(),
			body('count').notEmpty().isInt(),
			body('user_id').notEmpty().isInt(),
			validation,
		],
		cartAdd
	)
	.get(
		[body('user_id').notEmpty().isInt(), validation],
		body('cartItem_id').notEmpty().isInt(),
		(req, res, next) => {
			if (req.body.cartItem_id) {
				// 장바구니 선택 조회
				cartViewSelect(req, res, next);
			} else {
				// 장바구니 조회
				cartViewAll(req, res, next);
			}
		}
	);

// 장바구니 삭제
router.delete(
	'/:book_id',
	[param('book_id').notEmpty().isInt(), validation],
	cartDelete
);

export default router;
