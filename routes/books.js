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
	// 전체도서조회
	.get(async (req, res) => {
		res.status(200).json({ message: '전체도서조회' });
	})
	// 카테고리별 도서조회 -쿼리스트링
	.get(async (req, res) => {
		res.status(200).json({ message: '카테고리별 도서조회' });
	});

// 개별도서조회
router.get('/:book_id', async (req, res) => {
	res.status(200).json({ message: '개별도서조회' });
});

export default router;
