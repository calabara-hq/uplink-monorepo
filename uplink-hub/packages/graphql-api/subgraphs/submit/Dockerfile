FROM node:18-alpine
WORKDIR /app

# Copy all the necessary files for install
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

# Copy the source code of the workspaces
COPY ./packages/lib ./packages/lib

# Copy submit service
COPY ./packages/graphql-api/subgraphs/submit ./packages/submit
RUN yarn install
RUN yarn workspace lib build
RUN yarn workspace submit build

WORKDIR /app/packages/submit

CMD ["yarn", "start"]

