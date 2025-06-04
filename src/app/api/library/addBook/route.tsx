import Database from "@/app/utils/database";
import { verifySession } from "@/app/lib/dal";
import { checkBookExists, fetchBook } from "@/app/utils/bookCrud";

export async function POST(request: Request) {
    try {
        const { bookId, libraryId, note, review } = await request.json();
        if (!bookId || !libraryId) {
            return new Response(
                JSON.stringify({ error: "Missing bookId or libraryId" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const session = await verifySession();
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Session invalide ou utilisateur non autorisé" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const db = new Database();
        const connection = await db.getDB();        if (!(await checkBookExists(bookId))) {
            try {
                await fetchBook(bookId);
            } catch (error) {
                return new Response(
                    JSON.stringify({ error: "Book not found or could not be fetched", debug: error }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
        }

        const query = "INSERT INTO LibraryBooks (library_id, book_id, note, review) VALUES (?, ?, ?, ?)";
        await connection.query(query, [libraryId, bookId, note || null, review || null]);
        db.close();

        return new Response(
            JSON.stringify({ message: "Book added to library successfully" }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request body", debug: error }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}