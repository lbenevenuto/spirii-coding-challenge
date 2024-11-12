import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	console.log('GET from src/routes/api/test/+server.ts');

	return json('OK');
};
