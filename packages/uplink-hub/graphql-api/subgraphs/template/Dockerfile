from node:alpine
workdir /usr/src/app
copy package.json .
run yarn install
copy . /usr/src/app
expose 4000
CMD ["yarn", "dev"]
