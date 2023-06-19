FROM node:18-alpine
WORKDIR /app

# Copy all the necessary files for install
COPY ./package.json ./
COPY ./.yarnrc.yml ./.yarnrc.yml
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

# Copy the source code of the workspaces
COPY ./packages/lib ./packages/lib
COPY ./packages/media ./packages/media

# Install all dependencies
RUN yarn install

# Build the workspaces
RUN yarn workspace lib build
RUN yarn workspace media build

workdir /app/packages/media

CMD ["yarn", "start"]