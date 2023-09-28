database-push:
	cd ./packages/lib/src/drizzle && npx drizzle-kit push:mysql --config=./drizzle.config.json 

hotfix:
	var data = curl -L   -H "Accept: application/vnd.github+json"   -H "Authorization: Bearer $(githubToken)"   -H "X-GitHub-Api-Version: 2022-11-28"   https://api.github.com/repos/calabara-hq/uplink-monorepo/releases/latest
	echo$(data)
