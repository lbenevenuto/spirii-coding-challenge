import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { startCron } from '$lib/server/cron';

const initialHook: Handle = async ({ event, resolve }) => {
	console.log('custom server hook');

	startCron();

	return resolve(event);
};

export const handle = sequence(initialHook);
