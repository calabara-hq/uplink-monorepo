FROM node:alpine
WORKDIR /usr/src/app

# Copy root package.json, .yarnrc.yml, and .yarn directory
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./ 

# Copy lib
COPY ./packages/lib ./packages/lib

# Copy voting service
COPY ./packages/graphql-api/subgraphs/voting ./packages/voting

# Install dependencies for the voting service
RUN yarn install

RUN yarn workspace lib build

# Set the working directory for the voting service
WORKDIR /usr/src/app/packages/voting

EXPOSE 4000
CMD ["yarn", "dev"]

