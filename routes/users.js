import { Router } from 'express';
import jwt from 'jsonwebtoken';
import conn from '../mariadb.js';
import { config } from 'dotenv';
import { body, validationResult } from 'express-validator';
config();

const router = Router();
const { sign, verify } = jwt;

const validation = (req, res, next) => {
	const err = validationResult(req);
	if (err.isEmpty) {
		return next();
	} else {
		return res.status(404).json({ message: `입력을 제대로 하셔야 합니다.` });
	}
};

let email_pwReset = '';

// 로그인
router.post(
	'/login',
	[body('email').notEmpty().isEmail(), body('password').notEmpty(), validation],
	async (req, res, next) => {
		const { email, password } = req.body;
		const [userCheck] = await conn.query(
			`SELECT * FROM users WHERE email='${email}' AND password='${password}'`
		);
		const [userInfo] = userCheck;
		const { name } = userInfo;

		if (userCheck.length > 0) {
			return res.status(200).json({ message: `${name}님 환영합니다.` });
		} else {
			return res
				.status(404)
				.json({ message: '아이디나 비밀번호를 확인하세요.' });
		}
	}
);

// 회원가입
router.post(
	'/join',
	[body('email').notEmpty().isEmail(), body('password').notEmpty(), validation],
	async (req, res, next) => {
		const { email, name, password } = req.body;
		const [userCheck] = await conn.query(
			`SELECT * FROM users WHERE email='${email}'`
		);

		if (userCheck.length === 0) {
			await conn.query(
				`INSERT INTO users(email,name,password)
				VALUES('${email}','${name}','${password}')`
			);
			return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
		} else {
			return res.status(409).json({
				message: '중복되는 이메일입니다.',
			});
		}
	}
);

// 비밀번호 초기화
router
	.route('/reset')
	// 비밀번호 초기화 요청
	.post(
		[body('email').notEmpty().isEmail(), validation],
		async (req, res, next) => {
			const { email } = req.body;
			const [emailCheck] = await conn.query(
				`SELECT * FROM users WHERE email='${email}'`
			);
			if (emailCheck.length > 0) {
				email_pwReset = email;
				return res.status(200).json({ message: '인증코드를 입력하세요' });
			} else {
				return res.status(404).json({ message: '이메일을 확인하세요' });
			}
		}
	)
	// 비밀번호 초기화 수정
	.put([body('password').notEmpty(), validation], async (req, res, next) => {
		const { password } = req.body;
		const [pwCheck] = await conn.query(
			`SELECT * FROM users WHERE password='${password}'`
		);
		try {
			if (email_pwReset === '') {
				return res.status(404).json({ message: '인증번호를 먼저 받으세요.' });
			}
			if (pwCheck.length > 0) {
				return res
					.status(409)
					.json({ message: '이전과 다른 비밀번호로 설정하세요.' });
			} else {
				await conn.query(
					`UPDATE users SET password='${password}'
			WHERE email='${email_pwReset}'`
				);
				return res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
			}
		} finally {
			email_pwReset = '';
		}
	});

export default router;
