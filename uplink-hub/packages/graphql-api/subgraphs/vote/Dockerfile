# Build Stage for lib
FROM node:18-alpine AS builder
WORKDIR /app

# Copy all the necessary files for install
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

# Copy the source code of the workspaces
COPY ./packages/lib ./packages/lib
COPY ./packages/graphql-api/subgraphs/vote ./packages/graphql-api/subgraphs/vote

# Install all dependencies
RUN yarn install

# Build the workspaces
RUN yarn workspace lib build
RUN yarn workspace vote build

##################################

# Production Stage
FROM node:18-alpine
WORKDIR /app

# Copy the necessary runtime files from the builders
COPY --from=builder /app/packages/graphql-api/subgraphs/vote /app/packages/graphql-api/subgraphs/vote
COPY --from=builder /app/packages/lib /app/packages/lib
RUN ls /app/packages/graphql-api/subgraphs/vote

WORKDIR /app/packages/graphql-api/subgraphs/vote

# Set NODE_ENV to production for optimization
ENV NODE_ENV=production

CMD ["yarn", "start"]
