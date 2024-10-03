import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import {
	email_pwReset,
	join,
	login,
	resetPasswordRequest,
	resetPasswordUpdate,
} from '../controller/UserController.js';

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

email_pwReset;

router.post(
	'/login',
	[body('email').notEmpty().isEmail(), body('password').notEmpty(), validation],
	login
);

router.post(
	'/join',
	[body('email').notEmpty().isEmail(), body('password').notEmpty(), validation],
	join
);

router
	.route('/reset')
	.post([body('email').notEmpty().isEmail(), validation], resetPasswordRequest)
	.put([body('password').notEmpty(), validation], resetPasswordUpdate);

export default router;
