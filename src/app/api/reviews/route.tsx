import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const global = searchParams.get('global');

		const db = Database.getInstance();

		if (global === 'true') {
			// Récupérer les reviews publiques de tous les utilisateurs
			const query = `
				SELECT lb.review, lb.note, b.title, b.cover_image, 
					   lb.review_public, lb.library_id, lb.book_id, 
					   u.username, lb.created_at
				FROM librarybooks AS lb 
				JOIN libraries AS l ON l.id = lb.library_id 
				JOIN users AS u ON u.user_id = l.user_id 
				JOIN books AS b ON b.id = lb.book_id 
				WHERE lb.review_public = 'Y' 
				AND (lb.review IS NOT NULL OR lb.note IS NOT NULL)
				ORDER BY lb.created_at DESC
			`;
			const reviews = await db.query(query, []);
			return new Response(JSON.stringify(reviews), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} else {
			// Code existant pour les reviews de l'utilisateur connecté
			const session = await verifySession();
			const query = `
				SELECT review, note, title, cover_image, review_public, 
					   library_id, book_id 
				FROM librarybooks AS lb 
				JOIN libraries AS l ON l.id = lb.library_id 
				JOIN users AS u ON u.user_id = l.user_id 
				JOIN books AS b ON b.id = lb.book_id 
				WHERE u.user_id = $1
			`;
			const reviews = await db.query(query, [session.userId]);
			return new Response(JSON.stringify(reviews), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ error: 'Invalid request', debug: error }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
