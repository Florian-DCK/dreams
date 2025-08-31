import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function DELETE(request: Request) {
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
		const query =
			'DELETE FROM librarybooks WHERE book_id = $1 AND library_id = $2';
		await db.query(query, [bookId, libraryId]);

		return new Response(
			JSON.stringify({ message: 'Book removed from library successfully' }),
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
