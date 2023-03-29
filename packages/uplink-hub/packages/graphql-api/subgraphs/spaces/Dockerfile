FROM node:alpine
WORKDIR /usr/src/app

# Copy root package.json, .yarnrc.yml, and .yarn directory
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./ 

# Copy lib
COPY ./packages/lib ./packages/lib

# Copy spaces service
COPY ./packages/graphql-api/subgraphs/spaces ./packages/spaces

# Install dependencies for the spaces service
RUN yarn install

RUN yarn workspace lib generate-prisma
RUN yarn workspace lib build

# Set the working directory for the spaces service
WORKDIR /usr/src/app/packages/spaces

EXPOSE 4000
CMD ["yarn", "dev"]

