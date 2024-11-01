import { db } from '$lib/server/db';
import { TRANSACTIONS_API_URL } from '$env/static/private';
import { transactions } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { fetchAllData } from '$lib/server/utils';

export async function fetchTransactions(): Promise<void> {
	console.log('fetchTransactions');

	const responseJson = await fetchAllData(TRANSACTIONS_API_URL, 1);

	await db.insert(transactions).values(responseJson).onConflictDoNothing();
}

export async function getAggregatedData(userId: string) {
	const [result] = await db.all(
		sql.raw(
			`SELECT SUM(CASE WHEN type = 'earned' THEN amount ELSE 0 END)   AS earned,
              SUM(CASE WHEN type = 'spent' THEN amount ELSE 0 END)    AS spent,
              SUM(CASE WHEN type = 'paid out' THEN amount ELSE 0 END) AS paid_out,
              SUM(CASE WHEN type = 'payout' THEN amount ELSE 0 END)   AS payout
       FROM transactions
       WHERE userId = '${userId}'`
		)
	);

	return {
		earned: result?.earned || 0,
		spent: result?.spent || 0,
		payout: result?.payout || 0,
		paidOut: result?.paid_out || 0,
		balance: (result?.earned || 0) - (result?.spent || 0),
		balance_euro: Math.floor((result?.earned || 0) - (result?.spent || 0) - (result?.paid_out || 0))
	};
}

export async function getRequestedPayouts() {
	return db.all(
		sql.raw(
			`SELECT userId, SUM(amount) AS payoutAmount
       FROM transactions
       WHERE type = 'payout'
       GROUP BY userId`
		)
	);
}
