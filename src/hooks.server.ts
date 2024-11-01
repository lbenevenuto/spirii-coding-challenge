import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { fetchTransactions } from '$lib/server/transactions';

const lala: Handle = async ({ event, resolve }) => {
	console.log('custom server hook');

	// Data must be up to date with less than 2 minute’s delay
	setInterval(async () => {
		await fetchTransactions();
	}, 60000); // Fetch transactions every 60 seconds

	return resolve(event);
};

export const handle = sequence(lala);
