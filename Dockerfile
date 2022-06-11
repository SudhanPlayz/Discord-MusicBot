FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "deploy" ]

CMD [ "node", "index.js" ]
