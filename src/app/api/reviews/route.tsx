import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function GET() {
	try {
		const session = await verifySession();

		const db = new Database();
		const connection = await db.getDB();
		const query =
			'SELECT review, note, title, cover_image, review_public, library_id, book_id FROM LibraryBooks AS lb JOIN Library AS l ON l.id = lb.library_id JOIN Users AS u ON u.user_id = l.user_id JOIN Books AS b ON b.id = lb.book_id WHERE u.user_id = ?';
		const [reviews] = await connection.query(query, [session.userId]);

		return new Response(JSON.stringify(reviews), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Invalid request', debug: error }),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
