import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function POST(request: Request) {
	try {
		const [user_id, library_name, library_description, library_color] = await request.json();
		if (!user_id || !library_name) {
			return new Response(
				JSON.stringify({ error: 'Missing user_id or library_name' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const session = await verifySession();
		if (!session || session.userId !== user_id) {
			return new Response(
				JSON.stringify({
					error: 'Session invalide ou utilisateur non autorisé',
				}),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const db = new Database();
		const connection = await db.getDB();
		const query = 'INSERT INTO Library (user_id, name, description, color) VALUES (?, ?, ?, ?)';
		const [result] = await connection.query(query, [user_id, library_name, library_description, library_color]);
		db.close();
		return new Response(
			JSON.stringify({ message: 'Library created successfully' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid request body', debug: error }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
