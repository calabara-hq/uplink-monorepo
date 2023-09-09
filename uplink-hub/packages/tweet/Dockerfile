FROM node:18-alpine
WORKDIR /app

# Copy all the necessary files for install
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

# Copy the source code of the workspaces
COPY ./packages/lib ./packages/lib

# Copy tweet service
COPY ./packages/graphql-api/subgraphs/tweet ./packages/tweet
RUN yarn install
RUN yarn workspace lib build
RUN yarn workspace tweet build

WORKDIR /app/packages/tweet

CMD ["yarn", "start"]