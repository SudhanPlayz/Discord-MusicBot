FROM node:17.0.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run deploy

CMD [ "node", "index.js" ]
