FROM node:alpine
WORKDIR /usr/src/app

# Copy root package.json, .yarnrc.yml, and .yarn directory
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./ 

# Copy lib
COPY ./packages/lib ./packages/lib

# Copy submit service
COPY ./packages/graphql-api/subgraphs/submit ./packages/submit

# Install dependencies for the submit service
RUN yarn install

RUN yarn workspace lib build

# Set the working directory for the submit service
WORKDIR /usr/src/app/packages/submit

EXPOSE 4000
CMD ["yarn", "dev"]
