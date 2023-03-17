FROM node:alpine
WORKDIR /usr/src/app

# Copy root package.json, .yarnrc.yml, and .yarn directory
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./ 

# Copy shared-prisma
COPY ./packages/lib/shared-prisma ./packages/lib/shared-prisma

# Copy submissions service
COPY ./packages/graphql-api/subgraphs/submissions ./packages/submissions

# Install dependencies for the submissions service
RUN yarn install

# Set the working directory for the submissions service
WORKDIR /usr/src/app/packages/submissions

EXPOSE 4000
CMD ["yarn", "dev"]

