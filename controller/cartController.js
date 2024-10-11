import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';
import { login } from './UserController.js';

// 장바구니 담기
export const cartAdd = async (req, res, next) => {
	const { book_id, count, user_id } = req.body;
	const sql = `SELECT * FROM cartItems WHERE book_id=? AND user_id=?`;
	const params = [parseInt(book_id), parseInt(user_id)];
	const [result] = await conn.query(sql, params);
	const [{ quantity }] = result;

	if (result.length > 0) {
		await conn.query(
			`UPDATE cartItems
		  SET quantity=?
		  WHERE book_id=? AND user_id=?`,
			[parseInt(quantity) + 1, ...params]
		);
		return res
			.status(StatusCodes.OK)
			.json({ message: `이미 담겨있습니다. 수량을 추가합니다.` });
	}
	await conn.query(
		`INSERT INTO cartItems(user_id, book_id, quantity) VALUES(?, ?, ?)`,
		[...params, parseInt(count)]
	);
	return res.status(StatusCodes.OK).json({ message: '장바구니 담기' });
};

// 장바구니 조회
export const cartViewAll = async (req, res, next) => {
	const { user_id } = req.body;
	const sql = `SELECT cartItems.id, cartItems.book_id, books.title,
							books.summary, cartItems.quantity, books.price
							FROM cartItems
							LEFT JOIN books ON cartItems.book_id=books.id
							WHERE cartItems.user_id=?`;
	const [result] = await conn.query(sql, parseInt(user_id));
	if (result.length > 0) {
		return res.status(StatusCodes.OK).json(result);
	}
	return res
		.status(StatusCodes.OK)
		.json({ message: `장바구니가 비어있습니다.` });
};

// 장바구니 삭제
export const cartDelete = async (req, res, next) => {
	const { book_id, user_id } = req.params;
	const sql = `SELECT * FROM cartItems WHERE book_id=? AND user_id=?`;
	const params = [parseInt(book_id), parseInt(user_id)];
	const [result] = await conn.query(sql, params);
	const [{ quantity }] = result;

	if (result.length > 0 && parseInt(quantity) > 1) {
		await conn.query(
			`UPDATE cartItems
		  SET quantity=?
		  WHERE book_id=? AND user_id=?`,
			[parseInt(quantity) - 1, ...params]
		);
		return res
			.status(StatusCodes.OK)
			.json({ message: `2개 이상이 담겨 있습니다. 수량이 하나 감소합니다.` });
	} else if (result.length > 0 && parseInt(quantity) === 1) {
		await conn.query(
			`DELETE FROM cartItems
		  WHERE book_id=? AND user_id=?`,
			params
		);
		return res
			.status(StatusCodes.OK)
			.json({ message: `장바구니에서 삭제됐습니다.` });
	}
	return res
		.status(StatusCodes.OK)
		.json({ message: `장바구니에 존재하지 않음` });
};

// 장바구니 선택조회
export const cartViewSelect = async (req, res, next) => {
	const { user_id, cartItem_id } = req.body;
	const params = cartItem_id.map((n) => parseInt(n));

	const sql = `SELECT cartItems.id, cartItems.book_id, books.title,
							books.summary, cartItems.quantity, books.price
							FROM cartItems
							LEFT JOIN books ON cartItems.book_id=books.id
							WHERE cartItems.user_id=?
							AND cartItems.id IN (?)`;
	const [result] = await conn.query(sql, [parseInt(user_id), params]);
	if (result.length > 0) {
		return res.status(StatusCodes.OK).json(result);
	}
	return res
		.status(StatusCodes.OK)
		.json({ message: `장바구니가 비어있습니다.` });
};
