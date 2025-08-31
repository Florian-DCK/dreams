import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';
import { checkBookExists, fetchBook } from '@/app/utils/bookCrud';
import { CustomBookSchema } from '@/app/lib/definitions';

export async function POST(request: Request) {
	try {
		const { bookId, libraryId, note, review, customTitle, isPublic } =
			await request.json();
		if (!bookId || !libraryId) {
			return new Response(
				JSON.stringify({ error: 'Missing bookId or libraryId' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const result = CustomBookSchema.safeParse({
			note,
			review,
			custom_title: customTitle,
		});
		if (!result.success) {
			return new Response(
				JSON.stringify({
					error: 'Données invalides',
					details: result.error.format(),
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const session = await verifySession();
		if (!session) {
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
		const db = Database.getInstance();

		// Vérifier si la bibliothèque appartient à l'utilisateur
	const libraryOwnerQuery = 'SELECT user_id FROM libraries WHERE id = $1';
	const libraryOwnerResult = await db.query(libraryOwnerQuery, [libraryId]);
		if (libraryOwnerResult.length === 0) {
			return new Response(
				JSON.stringify({ error: "Cette bibliothèque n'existe pas" }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Récupérer l'ID utilisateur de manière plus sûre
		const libraryOwnerId = libraryOwnerResult[0]?.user_id;
		if (libraryOwnerId !== session.userId) {
			return new Response(
				JSON.stringify({ error: "Vous n'avez pas accès à cette bibliothèque" }),
				{
					status: 403,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Vérifier si le livre existe déjà dans une bibliothèque
		const checkExistingQuery =
			'SELECT * FROM librarybooks JOIN libraries ON libraries.id = librarybooks.library_id WHERE book_id = $1 AND user_id = $2';
		const existingResult = await db.query(checkExistingQuery, [
			bookId,
			session.userId,
		]);

		if (existingResult && existingResult.length > 0) {
			return new Response(
				JSON.stringify({
					error: 'Ce livre est déjà dans une bibliothèque',
					existingLibraryId: existingResult[0]?.library_id,
				}),
				{
					status: 409,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		if (!(await checkBookExists(bookId))) {
			try {
				await fetchBook(bookId);
			} catch (error) {
				return new Response(
					JSON.stringify({
						error: 'Book not found or could not be fetched',
						debug: error,
					}),
					{
						status: 404,
						headers: { 'Content-Type': 'application/json' },
					}
				);
			}
		}

		const query =
			'INSERT INTO librarybooks (library_id, book_id, note, review, custom_title, review_public) VALUES ($1, $2, $3, $4, $5, $6)';
		await db.query(query, [
			libraryId,
			bookId,
			note || null,
			review || null,
			customTitle || null,
			isPublic === true ? 'Y' : 'N',
		]);
		console.log(isPublic);

		return new Response(
			JSON.stringify({ message: 'Book added to library successfully' }),
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

export async function PUT(request: Request) {
	try {
		const { bookId, libraryId, note, review, customTitle, isPublic } =
			await request.json();
		if (!bookId || !libraryId) {
			return new Response(
				JSON.stringify({ error: 'Missing bookId or libraryId' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
		const result = CustomBookSchema.safeParse({
			note,
			review,
			custom_title: customTitle,
		});
		if (!result.success) {
			return new Response(
				JSON.stringify({
					error: 'Données invalides',
					details: result.error.format(),
				}),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		const session = await verifySession();
		if (!session) {
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
		const db = Database.getInstance();
		const query = `
			UPDATE librarybooks 
			SET note = $1, review = $2, custom_title = $3, review_public = $4 
			WHERE book_id = $5 AND library_id = $6
		`;
		const queryResult = await db.query(query, [
			note || null,
			review || null,
			customTitle || null,
			isPublic === true ? 'Y' : 'N',
			bookId,
			libraryId,
		]);
		if (queryResult.affectedRows === 0) {
			return new Response(
				JSON.stringify({ error: 'Book not found in library' }),
				{
					status: 404,
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}
		return new Response(
			JSON.stringify({ message: 'Book updated successfully' }),
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
