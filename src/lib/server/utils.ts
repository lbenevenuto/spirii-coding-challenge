interface ApiResponse {
	first: number;
	prev: number | null;
	next: number | null;
	last: number;
	pages: number;
	items: number;
	data: any[];
}

export async function fetchData(url: string, page: number): Promise<ApiResponse> {
	console.debug(`Fetching data from ${url} page ${page}`);

	// _per_page = 1000 is a requirement limit 1000 transactions
	const response = await fetch(`${url}?_page=${page}&_per_page=1000`);
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	return response.json();
}

export async function fetchAllData(url: string, page: number = 1): Promise<any[]> {
	const result = await fetchData(url, page);

	// Process the current page of data
	const allData = result.data;

	// Check if there is a next page
	if (result.next !== null) {
		// Fetch the next page recursively and concatenate the results
		const nextData = await fetchAllData(url, result.next);
		return allData.concat(nextData);
	}

	// Return all collected data
	return allData;
}
