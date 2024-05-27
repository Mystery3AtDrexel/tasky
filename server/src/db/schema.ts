import { text, sqliteTable, int } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';

// Declare DB schema in this file

export const users = sqliteTable('users', {
  id: int('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const tasks = sqliteTable('tasks', {
  id: int('id', { mode: 'number' })
    .notNull()
    .primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  color: text('color').notNull(),
  done: int('done', { mode: 'boolean' }).notNull(),
  userId: int('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
    relationName: 'task_user',
  }),
}));

export const insertTaskSchema = createInsertSchema(tasks)
  .required()
  .omit({ id: true });
export const updateTaskSchema = createInsertSchema(tasks).partial();

export const accounts = sqliteTable('accounts', {
  userId: int('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  provider: text('provider').notNull(),
  subject: text('subject').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts, { relationName: 'user_accounts' }),
  tasks: many(tasks, { relationName: 'user_tasks' }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
    relationName: 'account_user',
  }),
}));
