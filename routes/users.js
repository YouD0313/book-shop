import { Router } from 'express';
import jwt from 'jsonwebtoken';
import conn from '../mariadb.js';
import { config } from 'dotenv';
import { body, validationResult } from 'express-validator';
config();

const router = Router();
const { sign, verify } = jwt;

// 로그인
router.post(
	'/login',
	[(body('email').notEmpty().isEmail(), body('password').notEmpty())],
	async (req, res) => {
		const { email, password } = req.body;
		res.status(200).json({ message: 'hi' });
	}
);

// 회원가입
router.post(
	'/join',
	[(body('email').notEmpty().isEmail(), body('password').notEmpty())],
	async (req, res) => {
		const { email, password } = req.body;
		res.status(201).json({ message: 'hi' });
	}
);

// 비밀번호 초기화
router
	.route('/reset')
	.post([body('email').notEmpty().isEmail()], async (req, res) => {
		const { email } = req.body;
		res.status(200).json({ message: 'hi' });
	})
	.put([body('password').notEmpty()], async (req, res) => {
		const { password } = req.body;
		res.status(200).json({ message: 'hi' });
	});

export default router;
