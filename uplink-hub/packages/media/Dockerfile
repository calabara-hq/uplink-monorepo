from node:alpine
workdir /usr/src/app

copy ./package.json ./
copy ./.yarnrc.yml ./.yarnrc.yml
copy ./.yarn ./.yarn
copy ./yarn.lock ./

copy ./packages/lib ./packages/lib

copy ./packages/media ./packages/media
run yarn install

run yarn workspace lib build

workdir /usr/src/app/packages/media
expose 5000
CMD ["yarn", "dev"]
