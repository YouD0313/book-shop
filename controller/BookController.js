import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

// 전체 도서 조회
export const selectAll = async (req, res, next) => {
	const { limit, currentPage } = req.query;
	const offset = limit * (parseInt(currentPage) - 1);
	const sql = `SELECT books.id, books.title, books.img, books.category_id, category.genre AS category,
    books.summary, books.author, books.price, books.pub_Date,
		(SELECT COUNT(*) as liked FROM likes WHERE liked_book_id=books.id) AS likes
    FROM books
    LEFT JOIN category ON books.category_id=category.id
    LIMIT ? OFFSET ?`;
	const params = [parseInt(limit), offset];

	const [selectBookAll] = await conn.query(sql, params);
	res.status(StatusCodes.OK).json(selectBookAll);
};

// 카테고리별 도서 조회
export const selectCategory = async (req, res, next) => {
	const { limit, currentPage, category, isNew } = req.query;
	const offset = limit * (parseInt(currentPage) - 1);
	const params = [parseInt(limit), offset];

	let sql = `SELECT books.id, books.title, books. img, books.category_id, 
    category.genre AS category, books.summary, books.author, books.price, books.pub_Date,		
		(SELECT COUNT(*) as liked FROM likes WHERE liked_book_id=books.id) AS likes
    FROM books
    LEFT JOIN category ON books.category_id=category.id    
    `;

	if (isNew === 'true') {
		sql += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
          ${category ? `AND books.category_id=${parseInt(category)}` : ''}
          `;
	} else {
		sql += `WHERE books.category_id=${parseInt(category)}
          `;
	}

	sql += `LIMIT ? OFFSET ?`;

	const [selectBookIsNewCategory] = await conn.query(sql, params);
	if (selectBookIsNewCategory.length > 0) {
		return res.status(StatusCodes.OK).json(selectBookIsNewCategory);
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: `고객센터에 문의해주세요`,
		});
	}
};

// 개별 도서 조회
export const selectEach = async (req, res, next) => {
	const { book_id } = req.params;
	const { user_id } = req.body;
	const sql = `SELECT books.id, books.title, books.img, books.category_id,
    category.genre AS category, books.form, books.isbn, books.summary, books.detail,
    books.author, books.pages, books.contents, books.price, books.pub_Date,		
		(SELECT COUNT(*) as liked FROM likes WHERE liked_book_id=books.id) AS likes,
		(SELECT EXISTS (SELECT * FROM likes WHERE user_id=?
		AND liked_book_id=?)) AS liked
    FROM books
    LEFT JOIN category ON books.category_id=category.id
    WHERE books.id=?`;
	const params = [parseInt(user_id), parseInt(book_id), parseInt(book_id)];

	const [selectBookEach] = await conn.query(sql, params);

	if (selectBookEach.length > 0) {
		return res.status(StatusCodes.OK).json(selectBookEach[0]);
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: `해당하는 id값의 도서가 없습니다.`,
		});
	}
};
