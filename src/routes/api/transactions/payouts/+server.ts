import type { RequestHandler } from '@sveltejs/kit';
import { getRequestedPayouts } from '$lib/server/transactions';

export const GET: RequestHandler = async () => {
	console.log('GET from src/routes/api/transactions/payouts/+server.ts')

	const payouts = await getRequestedPayouts();
	return new Response(JSON.stringify(payouts), { status: 200 });
};