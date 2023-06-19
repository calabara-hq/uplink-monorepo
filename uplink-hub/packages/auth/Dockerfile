# ---- App Build Stage ----
from node:18-alpine as app-build
workdir /app
copy ./packages/auth ./packages/auth
workdir /app/packages/auth
run yarn install
run yarn build

# ---- App Run Stage ----
from node:18-alpine
workdir /app
copy --from=app-build /app/packages/auth/dist ./dist
copy --from=app-build /app/packages/auth/package.json ./
run yarn install
cmd ["yarn", "start"]

