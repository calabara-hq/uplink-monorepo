from node:alpine
workdir /usr/src/app

copy ./package.json ./
copy ./.yarnrc.yml ./.yarnrc.yml
copy ./.yarn ./.yarn
copy ./yarn.lock ./

copy ./packages/lib ./packages/lib

copy ./packages/auth ./packages/auth
run yarn install

run yarn workspace lib generate-prisma

run yarn workspace lib build

workdir /usr/src/app/packages/auth
expose 5000
CMD ["yarn", "dev"]
