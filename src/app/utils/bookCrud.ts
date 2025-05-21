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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/search?q=${id}`)
    const data = await response.json();
    if (data.items && data.items.length > 1) {
        throw new Error("Multiple books found.");
    } else if (data.items && data.items.length === 0) {
        throw new Error("Book not found.");
    }

    const book = data.items[0];
    console.log("Livre trouvé:", book); // Pour vérifier les données reçues
    return book; // Retourne le livre pour vérification
}