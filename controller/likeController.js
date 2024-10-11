import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

export const likedAdd = async (req, res, next) => {
	const { book_id } = req.params;
	const { user_id } = req.body;
	const params = [parseInt(user_id), parseInt(book_id)];
	const sqlSelect = `SELECT * FROM likes WHERE user_id=? AND liked_book_id=?`;
	const sqlCount = `SELECT COUNT(*) AS liked FROM likes WHERE liked_book_id=?`;
	const sqlInsert = `INSERT INTO likes (user_id, liked_book_id)
	VALUES (?, ?)`;
	const [result] = await conn.query(sqlSelect, params);
	if (result.length > 0) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: `이미 좋아요 한 책입니다.`,
		});
	}
	await conn.query(sqlInsert, params);
	const [countLikes] = await conn.query(sqlCount, parseInt(book_id));
	res.status(StatusCodes.OK).json({
		message: `${user_id}님이 ${book_id}의 도서를 좋아요 하셨습니다.`,
		likes: countLikes,
	});
};

export const likedDel = async (req, res, next) => {
	const { book_id } = req.params;
	const { user_id } = req.body;
	const params = [parseInt(user_id), parseInt(book_id)];
	const sqlSelect = `SELECT * FROM likes`;
	const sqlCount = `SELECT COUNT(*) AS liked FROM likes WHERE liked_book_id=?`;
	const sqlDelete = `DELETE FROM likes`;
	const where = ` WHERE user_id=? AND liked_book_id=?`;
	const [result] = await conn.query(sqlSelect + where, params);
	if (result.length > 0) {
		await conn.query(sqlDelete + where, params);
		const [countLikes] = await conn.query(sqlCount, parseInt(book_id));
		return res.status(StatusCodes.OK).json({
			message: `${user_id}님이 ${book_id}의 좋아요를 삭제하셨습니다.`,
			likes: countLikes,
		});
	}
	res.status(StatusCodes.BAD_REQUEST).json({
		message: `존재하지 않는 좋아요입니다.`,
	});
};
