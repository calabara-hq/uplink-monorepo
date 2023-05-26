FROM node:alpine
WORKDIR /usr/src/app

# Copy root package.json, .yarnrc.yml, and .yarn directory
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./ 

# Copy lib
COPY ./packages/lib ./packages/lib

# Copy vote service
COPY ./packages/graphql-api/subgraphs/vote ./packages/vote

# Install dependencies for the vote service
RUN yarn install

RUN yarn workspace lib build

# Set the working directory for the vote service
WORKDIR /usr/src/app/packages/vote

EXPOSE 4000
CMD ["yarn", "dev"]

