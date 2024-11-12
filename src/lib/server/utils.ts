export interface DataInterface {
	id: string;
	userId: string;
	createdAt: number;
	type: 'earned' | 'spent' | 'payout' | 'paid out';
	amount: number;
}

interface ApiResponseInterface {
	first: number;
	prev: number | null;
	next: number | null;
	last: number;
	pages: number;
	items: number;
	data: DataInterface[];
}

// _per_page = 1000 is a requirement limit 1000 transactions
const perPage = 1000;

export async function fetchData(
	url: string,
	page: number,
	createdAtGt: number
): Promise<ApiResponseInterface> {
	const newUrl = new URL(url);

	newUrl.searchParams.set('_page', page.toString());
	newUrl.searchParams.set('_per_page', perPage.toString());
	newUrl.searchParams.set('createdAt_gt', createdAtGt.toString());

	console.debug(`Fetching data from ${newUrl.toString()}`);

	const response = await fetch(newUrl.toString());
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
}

export async function fetchAllData(
	url: string,
	page: number = 1,
	createdAtGt: number
): Promise<DataInterface[]> {
	const result = await fetchData(url, page, createdAtGt);

	// Process the current page of data
	const allData = result.data;

	// Check if there is a next page
	if (result.next !== null) {
		// Fetch the next page recursively and concatenate the results
		const nextData = await fetchAllData(url, result.next, createdAtGt);
		return allData.concat(nextData);
	}

	// Return all collected data
	return allData;
}

export function unixToISO(unixTimestamp: number): string {
	return new Date(unixTimestamp * 1000).toISOString();
}
