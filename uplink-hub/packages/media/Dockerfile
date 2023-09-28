# Build Stage for lib
FROM node:18-alpine AS lib-builder
WORKDIR /app

# Copy necessary files for yarn and lib
COPY ./package.json ./
COPY ./.yarnrc.yml ./
COPY ./.yarn ./.yarn
COPY ./yarn.lock ./

COPY ./packages/lib ./packages/lib
RUN yarn install && yarn workspace lib build

# Build Stage for media
FROM node:18-alpine AS media-builder
WORKDIR /app

# Copy necessary files for yarn and media, including the built lib
COPY --from=lib-builder /app/package.json ./
COPY --from=lib-builder /app/.yarnrc.yml ./
COPY --from=lib-builder /app/.yarn ./.yarn
COPY --from=lib-builder /app/yarn.lock ./

COPY --from=lib-builder /app/packages/lib ./packages/lib
COPY ./packages/media ./packages/media

RUN yarn install && yarn workspace media build

# Production Stage
FROM node:18-alpine
WORKDIR /app/packages/media

# Copy the necessary runtime files from the builders
COPY --from=media-builder /app/package.json /app/
COPY --from=media-builder /app/.yarnrc.yml /app/
COPY --from=media-builder /app/.yarn /app/.yarn
COPY --from=media-builder /app/yarn.lock /app/

# Only copy the built dist directories of lib and media (assuming your build output goes to a dist folder)
COPY --from=lib-builder /app/packages/lib/dist /app/packages/lib/dist
COPY --from=media-builder /app/packages/media/dist /app/packages/media/dist

# Set NODE_ENV to production for optimization
ENV NODE_ENV=production

CMD ["yarn", "start"]
