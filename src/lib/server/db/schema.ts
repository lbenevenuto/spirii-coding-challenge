import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
	id: text('id').primaryKey(),
	userId: text('userId'),
	createdAt: text('createdAt'),
	type: text('type'),
	amount: real('amount'),
});
