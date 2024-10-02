import { Router } from 'express';
import jwt from 'jsonwebtoken';
import conn from '../mariadb.js';
import { config } from 'dotenv';
import { body, validationResult } from 'express-validator';
config();

const router = Router();
const { sign, verify } = jwt;

router
	.route('/:book_id')
	// 좋아요 추가
	.post(async (req, res) => {
		res.status(200).json({ message: '좋아요 추가' });
	})
	// 좋아요 삭제
	.delete(async (req, res) => {
		res.status(200).json({ message: '좋아요 삭제' });
	});

export default router;
