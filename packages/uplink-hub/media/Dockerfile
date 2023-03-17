from node:alpine
workdir /usr/src/app
copy package*.json .
run yarn install
copy . .
expose 5000
CMD ["yarn", "dev"]
