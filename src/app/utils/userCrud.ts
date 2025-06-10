import Database from '@/app/utils/database';

export async function getUser(email?: string, id?: string, username?: string) {
	let query = 'SELECT * FROM Users WHERE ';
	const db = Database.getInstance();

	if (email) {
		query += `email = ?`;
		const rows = await db.query(query, [email]);
		if (rows.length === 0) {
			throw new Error('User not found.');
		}
		return rows[0];
	} else if (id) {
		query += `id = ?`;
		const rows = await db.query(query, [id]);
		if (rows.length === 0) {
			throw new Error('User not found.');
		}
		return rows[0];
	} else if (username) {
		query += `username = ?`;
		const rows = await db.query(query, [username]);
		if (rows.length === 0) {
			throw new Error('User not found.');
		}
		return rows[0];
	} else {
		throw new Error('No email, id or username provided.');
	}
}

export async function createUser(
	username: string,
	email: string,
	password: string
) {
	const db = Database.getInstance();
	const query =
		'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)';
	const result = await db.query(query, [username, email, password]);
	return result;
}
