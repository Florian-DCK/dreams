import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await verifySession();
		const LibraryId = params.id;
		const db = Database.getInstance();

		const query = 'DELETE FROM Library WHERE id = ? AND user_id = ?';
		await db.query(query, [LibraryId, session.userId]);

		return new Response(
			JSON.stringify({ message: 'Library deleted successfully' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
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

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await verifySession();
		const LibraryId = params.id;
		const { title, description, couleur } = await request.json();
		const db = Database.getInstance();

		const query =
			'UPDATE Library SET name = ?, description = ?, color = ? WHERE id = ? AND user_id = ?';
		await db.query(query, [
			title,
			description,
			couleur,
			LibraryId,
			session.userId,
		]);

		return new Response(
			JSON.stringify({ message: 'Library updated successfully' }),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}
		);
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
