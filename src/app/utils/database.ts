
import { Pool } from 'pg';


export default class Database {
	private static instance: Database;
	private pool: Pool | null = null;

	private constructor() {
		this.initializePool();
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	private initializePool() {
		// Utilise DATABASE_URL (format PostgreSQL/Neon) si dispo, sinon fallback sur config manuelle
		const connectionString = process.env.DATABASE_URL;
		this.pool = new Pool(
			connectionString
				? { connectionString }
				: {
					  host: process.env.DB_HOST || 'localhost',
					  port: parseInt(process.env.DB_PORT || '5432', 10),
					  user: process.env.DB_USERNAME || 'user',
					  password: process.env.DB_PASSWORD || 'password',
					  database: process.env.DB_NAME || 'database',
				  }
		);
	}

	public async query(sql: string, params: any[] = []): Promise<any> {
		if (!this.pool) {
			throw new Error('Database pool not initialized');
		}
		try {
			const result = await this.pool.query(sql, params);
			return result.rows;
		} catch (error) {
			console.error('Database query failed:', error);
			throw error;
		}
	}

	public async close() {
		if (this.pool) {
			await this.pool.end();
			this.pool = null;
		}
	}

	public async testdb() {
		try {
			const rows = await this.query('SELECT 1 + 1 AS solution');
			console.log('Database test query result:', rows);
			return rows;
		} catch (error) {
			console.error('Database test query failed:', error);
			throw error;
		}
	}
}
