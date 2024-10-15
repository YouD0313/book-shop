import { createConnection } from 'mysql2/promise';

// Create the connection to database
const connection = await createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bookshop',
	dateStrings: true,
});

// const db = connection.promise();

// export default db;

export default connection;
