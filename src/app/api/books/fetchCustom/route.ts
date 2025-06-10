import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get('id');

	if (!id) {
		return new Response(JSON.stringify({ error: 'ID is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const session = await verifySession();
	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const db = Database.getInstance();
		const query =
			'SELECT * FROM LibraryBooks JOIN Library ON Library.id = LibraryBooks.library_id WHERE book_id = ? AND user_id = ?';
		const rows = await db.query(query, [id, session.userId]);
		if (rows.length === 0) {
			return new Response(
				JSON.stringify({ error: 'No custom data found for this book' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
		return new Response(JSON.stringify(rows), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error fetching custom book data:', error);
		return new Response(JSON.stringify({ error: 'Internal server error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
