from node:alpine
workdir /usr/src/app
copy ./packages/auth .
run yarn install
expose 5000
CMD ["yarn", "dev"]
