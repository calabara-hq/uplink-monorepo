FROM node:alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "src/index.ts"]
