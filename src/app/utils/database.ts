import mysql from 'mysql2/promise';

export default class Database {
	private static instance: Database;
	private pool: mysql.Pool | null = null;

	private constructor() {
		this.initializePool();
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}	private initializePool() {
		this.pool = mysql.createPool({
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT || '3306', 10),
			user: process.env.DB_USERNAME || 'user',
			password: process.env.DB_PASSWORD || 'password',
			database: process.env.DB_NAME || 'database',
			connectionLimit: 10, // Limite le nombre de connexions simultanées
			queueLimit: 0, // Pas de limite sur la file d'attente
			waitForConnections: true, // Attendre une connexion disponible
			multipleStatements: false,
		});
	}

	public async query(sql: string, params: any[] = []): Promise<any> {
		if (!this.pool) {
			throw new Error('Database pool not initialized');
		}

		try {
			const [rows] = await this.pool.execute(sql, params);
			return rows;
		} catch (error) {
			console.error('Database query failed:', error);
			throw error;
		}
	}

	public async getConnection() {
		if (!this.pool) {
			throw new Error('Database pool not initialized');
		}
		return await this.pool.getConnection();
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
