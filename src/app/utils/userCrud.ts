import Database from "@/app/utils/database";
export async function getUser(email?: string, id?: string, username?:string) {
    let query = "SELECT * FROM Users WHERE ";
    const db = new Database();
    const connection = await db.getDB();

    if (email) {
        query += `email = ?`;
        const [rows] = await connection.query(query, [email]);
        if (rows.length === 0) {
            db.close();
            throw new Error("User not found.");
        }
        return rows[0];
    }else if (id) {
        query += `id = ?`;
        const [rows] = await connection.query(query, [id]);        
        if (rows.length === 0) {
            db.close();
            throw new Error("User not found.");
        }
        return rows[0];
    }else if (username) {
        query += `username = ?`;
        const [rows] = await connection.query(query, [username]);        
        if (rows.length === 0) {
            db.close();
            throw new Error("User not found.");
        }
        return rows[0];
    } else {
        db.close();
        throw new Error("No email, id or username provided.");
    }
}

export async function createUser(username:string, email: string, password: string) {
    const db = new Database();
    const connection = await db.getDB();
    const query = "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)";
    const [result] = await connection.query(query, [username, email, password]);
    db.close();
    return result;
}