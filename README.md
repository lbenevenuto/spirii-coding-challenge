# Recruiting Challenge

## Assumptions
- As I don't have any API to call, I'm using a json-server to simulate the API, so the response is a little different from the one in the challenge
```json
{
	"first": 1,
	"prev": 1499,
	"next": null,
	"last": 1500,
	"pages": 1500,
	"items": 3000,
	"data": [
		{
			"id": "7d7bfd4e-b6f8-42f5-8105-fc2c11b36b17",
			"userId": "358850",
			"createdAt": "2023-03-24T15:11:49.000Z",
			"type": "earned",
			"amount": 28.36
		},
		{
			"id": "730346be-cb0c-49cc-aba0-c6b99b38f4cc",
			"userId": "358850",
			"createdAt": "2024-06-16T09:17:32.000Z",
			"type": "paid out",
			"amount": 53.85
		}
	]
}
```
- With json-server I can't do a lot of things, like filtering by date, so I'm loading all the transactions
- If I could filter by date, I could save the last date I fetched and only fetch the new transactions
- The balance in Euros I'm calculating as total earned - total spent - total paid_out, I don't know if this is the correct way to calculate it
- The Service having millions of requests per day I would deploy to Cloudflare pages. https://pages.cloudflare.com/

Clone the repository and run

```bash
cp .env.example .env
npm install -g json-server
json-server --watch transaction_items.json
bun install
bun run db:push
bun run dev
```

To check the DB you can run

```bash
bun run db:studio
```