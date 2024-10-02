import { Router } from 'express';
import jwt from 'jsonwebtoken';
import conn from '../mariadb.js';
import { config } from 'dotenv';
import { body, validationResult } from 'express-validator';
config();

const router = Router();
const { sign, verify } = jwt;

router
	.route('/')
	// 결제하기
	.post(async (req, res) => {
		res.status(200).json({ message: '결제하기' });
	})
	// 결제목록 조회
	.get(async (req, res) => {
		res.status(200).json({ message: '결제목록 조회' });
	});

// 주문 상세 상품 조회
router.get('/:book_id', async (req, res) => {
	res.status(200).json({ message: '주문 상세 상품 조회' });
});

export default router;
