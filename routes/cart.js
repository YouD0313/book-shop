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
	// 장바구니 추가
	.post(async (req, res) => {
		res.status(200).json({ message: '장바구니 추가' });
	})
	// 장바구니 조회
	.get(async (req, res) => {
		res.status(200).json({ message: '장바구니 조회' });
	});

router
	.route('/:book_id')
	// 장바구니 삭제
	.delete(async (req, res) => {
		res.status(200).json({ message: '장바구니 삭제' });
	})
	// 장바구니 선택 조회
	.get(async (req, res) => {
		res.status(200).json({ message: '장바구니 선택 조회' });
	});

export default router;
