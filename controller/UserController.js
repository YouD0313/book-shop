import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { config } from 'dotenv';
config();

const { sign, verify } = jwt;

// 로그인
export const login = async (req, res, next) => {
	const { email, password } = req.body;
	const [saltCheck] = await conn.query(
		`SELECT salt FROM users WHERE email='${email}'`
	);
	const [{ salt }] = saltCheck;
	const hashPassword = pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString(
		'base64'
	);

	const [userCheck] = await conn.query(
		`SELECT * FROM users WHERE email='${email}' AND password='${hashPassword}'`
	);

	const token = sign({ email }, process.env.PRIVATE_KEY, {
		expiresIn: '5m',
		issuer: 'YouD',
	});

	res.cookie('token', token, { httpOnly: true });

	if (userCheck.length > 0) {
		const [{ name }] = userCheck;
		return res
			.status(StatusCodes.OK)
			.json({ message: `${name}님 환영합니다.` });
	} else {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: '아이디나 비밀번호를 확인하세요.' });
	}
};

// 회원가입
export const join = async (req, res, next) => {
	const { email, name, password } = req.body;

	const [userCheck] = await conn.query(
		`SELECT * FROM users WHERE email='${email}'`
	);

	// 비밀번호 암호화
	const salt = randomBytes(10).toString('base64');
	const hashPassword = pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString(
		'base64'
	);

	if (userCheck.length === 0) {
		await conn.query(
			`INSERT INTO users(email, name, password, salt)
      VALUES('${email}','${name}','${hashPassword}','${salt}')`
		);
		return res
			.status(StatusCodes.CREATED)
			.json({ message: '회원가입이 완료되었습니다.' });
	} else {
		return res.status(StatusCodes.CONFLICT).json({
			message: '중복되는 이메일입니다.',
		});
	}
};

export let email_pwReset = '';

// 비밀번호 초기화 요청
export const resetPasswordRequest = async (req, res, next) => {
	const { email } = req.body;
	const [emailCheck] = await conn.query(
		`SELECT * FROM users WHERE email='${email}'`
	);

	const token = sign({ email }, process.env.PRIVATE_KEY, {
		expiresIn: '5m',
		issuer: 'YouD',
	});

	res.cookie('token', token, { httpOnly: true });

	if (emailCheck.length > 0) {
		email_pwReset = email;
		return res.status(StatusCodes.OK).json({ email });
	} else {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ message: '이메일을 확인하세요' });
	}
};

// 비밀번호 초기화 수정
export const resetPasswordUpdate = async (req, res, next) => {
	const { password } = req.body;
	const salt = randomBytes(10).toString('base64');
	const hashPassword = pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString(
		'base64'
	);
	const [pwCheck] = await conn.query(
		`SELECT * FROM users WHERE password='${password}'`
	);

	try {
		if (email_pwReset === '') {
			return res
				.status(StatusCodes.FORBIDDEN)
				.json({ message: '인증번호를 먼저 받으세요.' });
		}
		if (pwCheck.length > 0) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ message: '이전과 다른 비밀번호로 설정하세요.' });
		} else {
			await conn.query(
				`UPDATE users SET password='${hashPassword}', salt='${salt}'
    WHERE email='${email_pwReset}'`
			);
			return res
				.status(StatusCodes.OK)
				.json({ message: '비밀번호가 변경되었습니다.' });
		}
	} finally {
		email_pwReset = '';
	}
};
