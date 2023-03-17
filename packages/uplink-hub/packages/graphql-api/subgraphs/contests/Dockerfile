FROM node:alpine
WORKDIR /usr/src/app

# Copy root package.json, .yarnrc.yml, and .yarn directory
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./ 

# Copy shared-prisma
COPY ./packages/lib/shared-prisma ./packages/lib/shared-prisma

# Copy contests service
COPY ./packages/graphql-api/subgraphs/contests ./packages/contests

# Install dependencies for the contests service
RUN yarn install

# Set the working directory for the contests service
WORKDIR /usr/src/app/packages/contests

EXPOSE 4000
CMD ["yarn", "dev"]

