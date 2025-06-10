import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function PUT(request: Request) {
	try {
		const { bookId, libraryId } = await request.json();
		if (!bookId || !libraryId) {
			return new Response(
				JSON.stringify({ error: 'Missing bookId or libraryId' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const session = await verifySession();
		if (!session) {
			return new Response(
				JSON.stringify({ error: 'Invalid session or unauthorized user' }),
				{
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
		const db = Database.getInstance();
		const query = 'UPDATE LibraryBooks SET library_id = ? WHERE book_id = ?';
		await db.query(query, [libraryId, bookId]);

		return new Response(
			JSON.stringify({ message: 'Book moved to library successfully' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Invalid request body', debug: error }),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
