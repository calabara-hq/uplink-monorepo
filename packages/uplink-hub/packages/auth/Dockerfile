from node:alpine
workdir /usr/src/app

copy ./package.json ./
copy ./.yarnrc.yml ./.yarnrc.yml
copy ./.yarn ./.yarn
copy ./yarn.lock ./

# Copy shared-prisma
copy ./packages/lib/shared-prisma ./packages/lib/shared-prisma

copy ./packages/auth ./packages/auth
run yarn install
workdir /usr/src/app/packages/auth
expose 5000
CMD ["yarn", "dev"]
