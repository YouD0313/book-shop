import { createConnection } from 'mysql2';

// Create the connection to database
const connection = createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	database: 'Youtube',
	dateStrings: true,
});

const db = connection.promise();

export default db;
