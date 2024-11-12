export type TransactionType = {
	id: string;
	userId: string;
	createdAt: string;
	type: 'earned' | 'spent' | 'payout' | 'paid out';
	amount: number;
};

export type AggregatedDataType = {
	earned: number;
	spent: number;
	payout: number;
	paid_out: number;
	balance: number;
	balance_euro: string;
};
