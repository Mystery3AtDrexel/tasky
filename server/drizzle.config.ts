import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  driver: 'better-sqlite',
  out: process.env.DRIZZLE_MIGRATIONS_FOLDER,
  dbCredentials: {
    url: process.env.SQLITE_DB_FILE ?? '',
  },
  verbose: true,
  strict: true,
});
