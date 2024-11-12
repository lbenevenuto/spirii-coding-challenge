import type { BatchItem } from 'drizzle-orm/batch';
import type { AggregatedDataType } from '$lib/types';

import { db } from '$lib/server/db';
import { TRANSACTIONS_API_URL } from '$env/static/private';
import { transactions, transactionsFetch } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { fetchAllData } from '$lib/server/utils';

export async function fetchTransactions(): Promise<void> {
	console.log('fetchTransactions');

	try {
		const resultTf = await db.query.transactionsFetch.findFirst({
			orderBy: (tf, { desc }) => [desc(tf.latest)]
		});
		const dateNow = Math.floor(Date.now() / 1000);
		let createdAtGt = 0;
		if (resultTf) {
			createdAtGt = resultTf.latest;
		}

		const responseJson = await fetchAllData(TRANSACTIONS_API_URL, 1, createdAtGt);
		console.log('responseJson.length >>>', responseJson.length);

		const batch: [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]] = [
			db.insert(transactionsFetch).values({ latest: dateNow }).onConflictDoNothing()
		];
		if (responseJson.length > 0) {
			batch.push(db.insert(transactions).values(responseJson).onConflictDoNothing());
		}

		const [batchResult1, batchResult2] = await db.batch(batch);
		console.log('transactionsFetch rowsAffected >>>', batchResult1?.rowsAffected ?? 0);
		console.log('transactions rowsAffected      >>>', batchResult2?.rowsAffected ?? 0);
	} catch (error) {
		console.error('fetchTransactions error:', error);
	}
}

export async function getAggregatedData(userId: string) {
	const [result]: AggregatedDataType[] = await db.all(
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
