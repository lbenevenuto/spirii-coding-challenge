import cron from 'node-cron';
import { fetchTransactions } from '$lib/server/transactions';

let isJobRunning = false;

export function startCron(): void {
	cron.schedule('* * * * *', async () => {
		if (isJobRunning) {
			console.log('Job is already running, skipping this execution');
			return;
		}

		isJobRunning = true;
		try {
			console.log('running a task every minute');
			await fetchTransactions();
		} finally {
			isJobRunning = false;
			console.log('Job completed');
		}
	});
}
