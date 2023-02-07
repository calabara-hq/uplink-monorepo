from node:alpine
workdir /usr/src/app
copy ["package.json", "yarn.lock", "./"]
run yarn install
copy . .
expose 4002
CMD ["yarn", "dev"]
