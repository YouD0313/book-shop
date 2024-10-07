import { Router } from 'express';
import { config } from 'dotenv';
import { param, validationResult } from 'express-validator';
import { categoryAll, categoryEach } from '../controller/CategoryController.js';
config();
const router = Router();

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty()) {
		return next();
	} else {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ message: `입력을 제대로 하셔야 합니다.` });
	}
};

router.get('/', categoryAll);
router.get(
	'/:category_id',
	[param('category_id').notEmpty().isInt(), validation],
	categoryEach
);

export default router;
