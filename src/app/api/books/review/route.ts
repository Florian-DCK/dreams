import Database from "@/app/utils/database";

export async function DELETE(request: Request) {

}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const bookId = url.searchParams.get("bookId");
        if (!bookId) {
            return new Response(
                JSON.stringify({ error: "Missing bookId" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const db = new Database();
        const connection = await db.getDB();
        const query = "SELECT note, review, Users.username FROM LibraryBooks JOIN Library ON Library.id = LibraryBooks.library_id JOIN Users ON Users.user_id = Library.user_id WHERE book_id = ? AND review_public = 'Y' AND note IS NOT NULL";
        const [rows] = await connection.query(query, [bookId]);
        db.close();

        if (rows.length === 0) {
            return new Response(
                JSON.stringify({ error: "Book not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid request body", debug: error }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}