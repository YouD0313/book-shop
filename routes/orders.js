import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
	order,
	orderList,
	orderListDetail,
} from '../controller/orderController.js';

const router = Router();

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty()) {
		return next();
	}
	return res.status(StatusCodes.BAD_REQUEST).end();
};

router
	.route('/')
	// 결제하기
	.post(
		[
			body('totalQuantity').notEmpty().isInt(),
			body('totalPrice').notEmpty().isInt(),
			body('user_id').notEmpty().isInt(),
			validation,
		],
		order
	)
	// 결제목록 조회
	.get([body('user_id').notEmpty().isInt(), validation], orderList);

// 주문 상세 상품 조회
router.get(
	'/:order_id',
	[param('order_id').notEmpty().isInt(), validation],
	orderListDetail
);

export default router;
