import type { RequestHandler } from '@sveltejs/kit';
import { getAggregatedData } from '$lib/server/transactions';

export const GET: RequestHandler = async ({ params }) => {
	console.log('GET from src/routes/api/transactions/[userId]/+server.ts')

	const userId = params.userId as string;
	const data = await getAggregatedData(userId);
	return new Response(JSON.stringify(data), { status: 200 });
};