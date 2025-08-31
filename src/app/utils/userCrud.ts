import Database from '@/app/utils/database';

export async function getUser(email?: string, id?: string, username?: string) {
	const db = Database.getInstance();
	let query = 'SELECT * FROM users WHERE ';
	let param;
	if (email) {
		query += 'email = $1';
		param = [email];
	} else if (id) {
		query += 'user_id = $1';
		param = [id];
	} else if (username) {
		query += 'username = $1';
		param = [username];
	} else {
		throw new Error('No email, id or username provided.');
	}
	const rows = await db.query(query, param);
	if (!rows || rows.length === 0) {
		throw new Error('User not found.');
	}
	return rows[0];
}

export async function createUser(
	username: string,
	email: string,
	password: string
) {
	const db = Database.getInstance();
	// user_id est généré automatiquement par DEFAULT gen_random_uuid()
	const query =
	'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *';
	const rows = await db.query(query, [username, email, password]);
	return rows[0];
}
