export type TransactionType = {
	id: string;
	userId: string;
	createdAt: string;
	type: 'earned' | 'spent' | 'payout' | 'paid out';
	amount: number;
};