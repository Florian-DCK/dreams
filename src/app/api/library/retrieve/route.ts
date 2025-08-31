import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function GET() {
	try {
		const session = await verifySession();

	const db = Database.getInstance();
	const query = 'SELECT * FROM libraries WHERE user_id = $1';
	const libraries = await db.query(query, [session.userId]);

		// récupérer les livres dans chaque bibliothèque
		for (const library of libraries) {
			const booksQuery = 'SELECT * FROM librarybooks WHERE library_id = $1';
			const books = await db.query(booksQuery, [library.id]);
			for (const book of books) {
				// récupérer les informations du livre
				const bookQuery = 'SELECT * FROM books WHERE id = $1';
				const bookDetails = await db.query(bookQuery, [book.book_id]);
				book.details = bookDetails[0]; // ajouter les détails du livre à l'objet book
			}
			library.books = books;
		}

		return new Response(JSON.stringify(libraries), {
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
