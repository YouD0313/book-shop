import { createConnection } from 'mysql2';

// Create the connection to database
const connection = createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bookshop',
	dateStrings: true,
});

const db = connection.promise();

export default db;
