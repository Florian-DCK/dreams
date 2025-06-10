import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function GET() {
	try {
		const session = await verifySession();

		const db = new Database();
		const connection = await db.getDB();

		const query = `
            SELECT 
            COUNT(*) AS total_books, 
            SUM(b.page_count) AS total_pages, 
            COUNT(DISTINCT b.author) AS unique_authors, 
            COUNT(DISTINCT b.publisher) AS unique_publishers,
            ROUND(SUM(b.page_count) * 1.5 / 60, 1) AS estimated_reading_hours,
            (SELECT b2.author 
            FROM Books AS b2 
            JOIN LibraryBooks AS lb2 ON b2.id = lb2.book_id 
            JOIN Library AS l2 ON l2.id = lb2.library_id 
            JOIN Users AS u2 ON u2.user_id = l2.user_id 
            WHERE u2.user_id = ?
            GROUP BY b2.author 
            ORDER BY AVG(lb2.note) DESC 
            LIMIT 1) AS favorite_author,
            (SELECT b3.author 
            FROM Books AS b3 
            JOIN LibraryBooks AS lb3 ON b3.id = lb3.book_id 
            JOIN Library AS l3 ON l3.id = lb3.library_id 
            JOIN Users AS u3 ON u3.user_id = l3.user_id 
            WHERE u3.user_id = ?
            GROUP BY b3.author 
            ORDER BY COUNT(*) DESC 
            LIMIT 1) AS most_read_author,
            AVG(lb.note) AS average_rating
        FROM Books AS b 
        JOIN LibraryBooks AS lb ON b.id = lb.book_id 
        JOIN Library AS l ON l.id = lb.library_id 
        JOIN Users AS u ON u.user_id = l.user_id 
        WHERE u.user_id = ?
        GROUP BY u.user_id;
        `;
		const [stats] = await connection.query(query, [
			session.userId,
			session.userId,
			session.userId,
		]);
		if (stats.length === 0) {
			return new Response(
				JSON.stringify({ error: 'No statistics found for this user' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
		return new Response(JSON.stringify(stats[0]), {
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
