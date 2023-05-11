include .env
export

generate-db:
	DATABASE=${DATABASE} npx drizzle-kit generate:mysql --config=./src/drizzle/config.ts --schema=./src/drizzle/schema.ts --out=./src/drizzle/migrations
migrate-db:
	DATABASE=${DATABASE} npx drizzle-kit push:mysql --config=./src/drizzle/config.ts

