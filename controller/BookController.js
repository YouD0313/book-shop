import { query } from 'express';
import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

// 전체 도서 조회
export const selectAll = async (req, res, next) => {
	const { limit, currentPage } = req.query;
	const offset = limit * (currentPage - 1);

	const [selectBookAll] = await conn.query(
		`SELECT books.id, books.title, books.img, books.category_id, category.genre AS category,
    books.summary, books.author, books.price, books.pub_Date 
    FROM books
    LEFT JOIN category ON books.category_id=category.id
    LIMIT ${limit} OFFSET ${offset}`
	);
	res.status(StatusCodes.OK).json(selectBookAll);
};

// 카테고리별 도서 조회
export const selectCategory = async (req, res, next) => {
	const { limit, currentPage, category, isNew } = req.query;
	const offset = limit * (currentPage - 1);

	let sql = `SELECT books.id, books.title,books. img, books.category_id, 
    category.genre AS category, books.summary, books.author, books.price, books.pub_Date    
    FROM books
    LEFT JOIN category ON books.category_id=category.id    
    `;

	if (isNew === 'true') {
		sql += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()
          ${category ? `AND books.category_id='${category}'` : ''}
          `;
	} else {
		sql += `WHERE books.category_id='${category}'
          `;
	}

	sql += `LIMIT ${limit} OFFSET ${offset}`;

	const [selectBookIsNewCategory] = await conn.query(sql);
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

	const [selectBookEach] = await conn.query(
		`SELECT books.id, books.title, books.img, books.category_id,
    category.genre AS category, books.form, books.isbn, books.summary, books.detail,
    books.author, books.pages, books.contents, books.price, books.pub_Date
    FROM books
    LEFT JOIN category ON books.category_id=category.id
    WHERE books.id='${book_id}'`
	);

	if (selectBookEach.length > 0) {
		return res.status(StatusCodes.OK).json(selectBookEach[0]);
	} else {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: `해당하는 id값의 도서가 없습니다.`,
		});
	}
};
