import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const transactionsFetch = sqliteTable('transactions_fetch', {
	id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
	latest: integer('latest').notNull().unique()
});

export const transactions = sqliteTable('transactions', {
	id: text('id').primaryKey(),
	userId: text('userId'),
	createdAt: integer('createdAt'),
	type: text('type'),
	amount: real('amount')
});
