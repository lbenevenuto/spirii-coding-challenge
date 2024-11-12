import { json, type RequestHandler } from '@sveltejs/kit';
import { fetchTransactions } from '$lib/server/transactions';

export const GET: RequestHandler = async () => {
	console.log('GET from src/routes/api/fetch/+server.ts');

	await fetchTransactions();

	return json('ok');
};
