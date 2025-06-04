
import Database from '@/app/utils/database';
import { verifySession } from '@/app/lib/dal';

export async function GET() {
    try {
        const session = await verifySession();

        const db = new Database();
        const connection = await db.getDB();
        const query = 'SELECT * FROM Library WHERE user_id = ?';
        const [libraries] = await connection.query(query, [session.userId]);
        // récupérer les livres dans chaque bibliothèque
        for (const library of libraries) {
            const booksQuery = 'SELECT * FROM LibraryBooks WHERE library_id = ?';
            const [books] = await connection.query(booksQuery, [library.id]);
            for (const book of books) {
                // récupérer les informations du livre
                const bookQuery = 'SELECT * FROM Books WHERE id = ?';
                const [bookDetails] = await connection.query(bookQuery, [book.book_id]);
                book.details = bookDetails[0]; // ajouter les détails du livre à l'objet book
            }
            library.books = books;
        }

        return new Response(JSON.stringify(libraries), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request', debug: error }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}