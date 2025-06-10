import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: { library_id: string; book_id: string } }
) {
	try {
		const session = await verifySession();
		const db = Database.getInstance();
		const { library_id, book_id } = params;

		// Vérifier si la bibliothèque appartient à l'utilisateur
		const libraryQuery = 'SELECT * FROM Library WHERE id = ? AND user_id = ?';
		const library = await db.query(libraryQuery, [library_id, session.userId]);

		if (library.length === 0) {
			return NextResponse.json(
				{ error: 'Library not found or does not belong to user' },
				{ status: 404 }
			);
		}

		// Récupérer le livre spécifique dans la bibliothèque
		const bookQuery =
			'SELECT * FROM LibraryBooks WHERE library_id = ? AND book_id = ?';
		const book = await db.query(bookQuery, [library_id, book_id]);

		if (book.length === 0) {
			return NextResponse.json(
				{ error: 'Book not found in the specified library' },
				{ status: 404 }
			);
		}

		// Récupérer les détails du livre
		const bookDetailsQuery = 'SELECT * FROM Books WHERE id = ?';
		const bookDetails = await db.query(bookDetailsQuery, [book_id]);

		if (bookDetails.length === 0) {
			return NextResponse.json(
				{ error: 'Book details not found' },
				{ status: 404 }
			);
		}

		// Ajouter les détails du livre à l'objet book
		book[0].details = bookDetails[0];

		return NextResponse.json(book[0], { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Invalid request', debug: error },
			{ status: 400 }
		);
	}
}
