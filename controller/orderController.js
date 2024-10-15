import { param } from 'express-validator';
import conn from '../mariadb.js';
import { StatusCodes } from 'http-status-codes';

/**
 *  주문하기 sql 모듈
 */
const funDelivery = async (req) => {
	const { address, receiver, contact } = req.body.delivery;
	const sqlDelivery = `INSERT INTO delivery(address, receiver, contact)
                      VALUES(?, ?, ?)`;
	const paramsDelivery = [address, receiver, contact];
	try {
		const [resultDelivery] = await conn.query(sqlDelivery, paramsDelivery);
		const lastIdDelivery = resultDelivery.insertId;
		return lastIdDelivery;
		// const [lastIdDelivery] = await conn.query(`SELECT LAST_INSERT_ID()`);
	} catch {}
};

const funOrders = async (req, lastIdDelivery) => {
	const { firstBookTitle, totalQuantity, totalPrice, user_id } = req.body;
	const sqlOrder = `INSERT INTO orders(user_id, delivery_id, firstBookTitle, total_quantity, total_price)
                    VALUES(?, ?, ?, ?, ?)`;
	const paramsOrder = [
		user_id,
		lastIdDelivery,
		firstBookTitle,
		totalQuantity,
		totalPrice,
	];
	try {
		const [resultOrder] = await conn.query(sqlOrder, paramsOrder);
		const lastIdOrder = resultOrder.insertId;
		return lastIdOrder;
		// const [lastIdOrder] = await conn.query(`SELECT LAST_INSERT_ID()`);
	} catch {}
};

const funOrderedBook = async (req, lastIdOrder) => {
	const { cartItem_id } = req.body;
	const sqlOrderedBook = `INSERT INTO orderedBook(order_id, book_id, quantity)
                          VALUES(?, ?, ?)`;
	try {
		const sqlSelect = `SELECT book_id, quantity FROM cartItems WHERE cartItems.id IN (?)`;
		const [cartItems] = await conn.query(sqlSelect, [cartItem_id]);
		for (const { book_id, quantity } of cartItems) {
			const paramsOrderedBook = [lastIdOrder, book_id, quantity];
			await conn.query(sqlOrderedBook, paramsOrderedBook);
		}
	} catch {}
};

const deleteCartItems = async (req, lastIdOrder) => {
	const { cartItem_id } = req.body;
	const sqlDeleteCartItems = `DELETE FROM cartItems WHERE cartItems.id IN (?)`;
	const params = [];
	cartItem_id.forEach((item) => {
		params.push(item.book_id);
	});
	await conn.query(sqlDeleteCartItems, [cartItem_id]);
};

// 주문하기
export const order = async (req, res, next) => {
	const lastIdDelivery = await funDelivery(req);
	const lastIdOrder = await funOrders(req, lastIdDelivery);
	await funOrderedBook(req, lastIdOrder);
	await deleteCartItems(req, lastIdOrder);

	res.status(StatusCodes.OK).json({ message: `결제하기` });
};

// 주문 목록 조회
export const orderList = async (req, res, next) => {
	const { user_id } = req.body;
	const sqlSelectOrders = `SELECT orders.id, orders.create_at, delivery.address,
                          delivery.receiver, delivery.contact, orders.firstBookTitle,
                          orders.total_quantity, orders.total_price
                          FROM orders                          
                          LEFT JOIN delivery ON orders.delivery_id=delivery.id
                          WHERE orders.user_id=?`;

	const [resultUserIdOrder] = await conn.query(sqlSelectOrders, [
		parseInt(user_id),
	]);

	res.status(StatusCodes.OK).json(resultUserIdOrder);
};

// 주문 상세 조회
export const orderListDetail = async (req, res, next) => {
	const { order_id } = req.params;
	const sqlSelectOrders = `SELECT user_id FROM orders WHERE user_id=?`;
	const [resultUserIdOrders] = await conn.query(sqlSelectOrders, [
		parseInt(order_id),
	]);
	const [{ user_id }] = resultUserIdOrders;
	console.log(user_id);

	const sqlSelectOrderedBook = `SELECT books.id, books.title, books.author, 
                                books.price, orderedBook.quantity
                                FROM orderedBook
                                LEFT JOIN books
                                ON orderedBook.book_id=books.id
                                WHERE orderedBook.order_id=?`;
	const [resultUserIdOrderedBook] = await conn.query(sqlSelectOrderedBook, [
		user_id,
	]);
	res.status(StatusCodes.OK).json(resultUserIdOrderedBook);
};
