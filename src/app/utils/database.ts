import mysql from 'mysql2/promise';

export default class Database{
    private static instance: Database;
    private db: any;
    private hostname: string;
    private port: number;
    private username: string;
    private password: string;
    private databaseName: string;

    public constructor() {
        this.hostname = process.env.DB_HOST || 'localhost';
        this.port = parseInt(process.env.DB_PORT || '5432', 10);
        this.username = process.env.DB_USERNAME || 'user';
        this.password = process.env.DB_PASSWORD || 'password';
        this.databaseName = process.env.DB_NAME || 'database';
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private async connect() {
        if (!this.db) {
            this.db = await mysql.createConnection({
                host: this.hostname,
                port: this.port,
                user: this.username,
                password: this.password,
                database: this.databaseName,
            });
        }
        return this.db;
    }

    public async close() {
        if (this.db) {
            await this.db.end();
            this.db = null;
        }
    }

    public async query(sql: string, params: any[] = []) {
        try {
            const db = await this.connect();
            const [rows] = await db.query(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query failed:', error);
            throw error;
        }
    }

    public async getDB() {
        return await this.connect();
    }

    public async testdb() {
        try {
            const db = await this.getDB();
            const [rows] = await db.query('SELECT 1 + 1 AS solution');
            console.log('Database test query result:', rows);
            return rows;
        } catch (error) {
            console.error('Database test query failed:', error);
            throw error;
        }
    }
}