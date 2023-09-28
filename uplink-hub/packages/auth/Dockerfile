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

# Build Stage for auth
FROM node:18-alpine AS auth-builder
WORKDIR /app

# Copy necessary files for yarn and auth, including the built lib
COPY --from=lib-builder /app/package.json ./
COPY --from=lib-builder /app/.yarnrc.yml ./
COPY --from=lib-builder /app/.yarn ./.yarn
COPY --from=lib-builder /app/yarn.lock ./

COPY --from=lib-builder /app/packages/lib ./packages/lib
COPY ./packages/auth ./packages/auth

RUN yarn install && yarn workspace auth build

# Production Stage
FROM node:18-alpine
WORKDIR /app/packages/auth

# Copy the necessary runtime files from the builders
COPY --from=auth-builder /app/package.json /app/
COPY --from=auth-builder /app/.yarnrc.yml /app/
COPY --from=auth-builder /app/.yarn /app/.yarn
COPY --from=auth-builder /app/yarn.lock /app/

# Only copy the built dist directories of lib and auth (assuming your build output goes to a dist folder)
COPY --from=lib-builder /app/packages/lib/dist /app/packages/lib/dist
COPY --from=auth-builder /app/packages/auth/dist /app/packages/auth/dist

# Set NODE_ENV to production for optimization
ENV NODE_ENV=production

CMD ["yarn", "start"]
