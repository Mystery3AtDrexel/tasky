import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as Database from 'better-sqlite3';
import * as schema from './schema';

const SQLITE_DB_FILE = process.env.SQLITE_DB_FILE;
const DRIZZLE_MIGRATIONS_FOLDER = process.env.DRIZZLE_MIGRATIONS_FOLDER;

const sqlite = new Database(SQLITE_DB_FILE);
export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: DRIZZLE_MIGRATIONS_FOLDER ?? '' });
