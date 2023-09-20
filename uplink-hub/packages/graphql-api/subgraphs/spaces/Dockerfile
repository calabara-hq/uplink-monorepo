FROM node:18-alpine
WORKDIR /app

# Copy all the necessary files for install
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

# Copy the source code of the workspaces
COPY ./packages/lib ./packages/lib

# Copy spaces service
COPY ./packages/graphql-api/subgraphs/spaces ./packages/spaces
RUN yarn install
RUN yarn workspace lib build
RUN yarn workspace spaces build

WORKDIR /app/packages/spaces

env NODE_ENV production

CMD ["yarn", "start"]

