"use server";
import Database from "@/app/utils/database";

/**
 * Retourne un livre de la base de données
 * @param id l'id du livre à récupérer
 * @returns un objet contenant les informations du livre
 */
export async function getBook(id: string) {
    const db = new Database();
    const connection = await db.getDB();
    const query = "SELECT * FROM Books WHERE id = ?";
    const [rows] = await connection.query(query, [id]);
    db.close();
    if (rows.length === 0) {
        throw new Error("Book not found.");
    }
    return rows[0];
}

/**
 * Vérifie si un livre existe dans la base de données
 * @param id l'id du livre à vérifier
 * @returns true si le livre existe en db, false sinon
 */
export async function checkBookExists(id: string) {
    const db = new Database();
    const connection = await db.getDB();
    const query = "SELECT * FROM Books WHERE id = ?";
    const [rows] = await connection.query(query, [id]);
    db.close();
    return rows.length > 0;
}
/**
 * 
 * @param id l'id du livre à récupérer et à ajouter à la base de données
 * @returns true si le livre a été ajouté, false sinon
 */
export async function fetchBook(id: string) {
    // Utiliser une URL absolue pour l'API
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${BASE_URL}/api/books/get?id=${encodeURIComponent(id)}`)
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
        throw new Error("Book not found.");
    }

    const book = data.data;
    try {
        const db = new Database();
        const connection = await db.getDB();
        const query = "INSERT INTO Books (id, title, author, publisher, published_date, page_count, description, cover_image, isbn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let isbn = "Unknown";
        if (book.volumeInfo.industryIdentifiers) {
            const isbnObj = book.volumeInfo.industryIdentifiers.find(id => id.type === "ISBN_13" || id.type === "ISBN_10");
            if (isbnObj) isbn = isbnObj.identifier;
        }
        const values = [
            book.id,
            book.volumeInfo.title,
            book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown",
            book.volumeInfo.publisher || "Unknown",
            book.volumeInfo.publishedDate 
                ? (/^\d{4}$/.test(book.volumeInfo.publishedDate) 
                    ? `${book.volumeInfo.publishedDate}-01-01` 
                    : book.volumeInfo.publishedDate.split("T")[0]) 
                : null,
            book.volumeInfo.pageCount || 0,
            book.volumeInfo.description || "No description available",
            book.volumeInfo.imageLinks?.thumbnail || book.volumeInfo.imageLinks?.smallThumbnail || "https://placehold.co/118x190?text=No+Image",
            isbn
        ];
        await connection.query(query, values);
        db.close();
    } catch (error) {
        console.error("Erreur lors de la récupération du livre:", error);
        
    }
    return book;
}