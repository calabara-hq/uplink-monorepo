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

# Build Stage for spaces
FROM node:18-alpine AS spaces-builder
WORKDIR /app

# Copy necessary files for yarn and spaces, including the built lib
COPY --from=lib-builder /app/package.json ./
COPY --from=lib-builder /app/.yarnrc.yml ./
COPY --from=lib-builder /app/.yarn ./.yarn
COPY --from=lib-builder /app/yarn.lock ./

COPY --from=lib-builder /app/packages/lib ./packages/lib
COPY ./packages/graphql-api/subgraphs/spaces ./packages/graphql-api/subgraphs/spaces

RUN yarn install && yarn workspace spaces build

# Production Stage
FROM node:18-alpine
WORKDIR /app/packages/graphql-api/subgraphs/spaces

# Copy the necessary runtime files from the builders
COPY --from=spaces-builder /app/package.json /app/
COPY --from=spaces-builder /app/.yarnrc.yml /app/
COPY --from=spaces-builder /app/.yarn /app/.yarn
COPY --from=spaces-builder /app/yarn.lock /app/

# Only copy the built dist directories of lib and spaces (assuming your build output goes to a dist folder)
COPY --from=lib-builder /app/packages/lib/dist /app/packages/lib/dist
COPY --from=spaces-builder /app/packages/graphql-api/subgraphs/spaces /app/packages/graphql-api/subgraphs/spaces

# Set NODE_ENV to production for optimization
ENV NODE_ENV=production

CMD ["yarn", "start"]
