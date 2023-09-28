# Build Stage for lib
FROM node:18-alpine AS lib-builder
WORKDIR /app

# Copy necessary files for yarn and lib
COPY ./package.json ./
COPY ./.yarnrc.yml ./
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

COPY ./packages/lib ./packages/lib
RUN yarn install && yarn workspace lib build

# Build Stage for contests
FROM node:18-alpine AS contests-builder
WORKDIR /app

# Copy necessary files for yarn and contests, including the built lib
COPY --from=lib-builder /app/package.json ./
COPY --from=lib-builder /app/.yarnrc.yml ./
COPY --from=lib-builder /app/.yarn ./.yarn
COPY --from=lib-builder /app/yarn.lock ./

COPY --from=lib-builder /app/packages/lib ./packages/lib
COPY ./packages/graphql-api/subgraphs/contests ./packages/graphql-api/subgraphs/contests

RUN yarn install && yarn workspace contests build

# Production Stage
FROM node:18-alpine
WORKDIR /app/packages/graphql-api/subgraphs/contests

# Copy the necessary runtime files from the builders
COPY --from=contests-builder /app/package.json /app/
COPY --from=contests-builder /app/.yarnrc.yml /app/
COPY --from=contests-builder /app/.yarn /app/.yarn
COPY --from=contests-builder /app/yarn.lock /app/

# Only copy the built dist directories of lib and contests (assuming your build output goes to a dist folder)
COPY --from=lib-builder /app/packages/lib/dist /app/packages/lib/dist
COPY --from=contests-builder /app/packages/graphql-api/subgraphs/contests /app/packages/graphql-api/subgraphs/contests

# Set NODE_ENV to production for optimization
ENV NODE_ENV=production

CMD ["yarn", "start"]
