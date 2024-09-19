FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

RUN npm run build

EXPOSE 3500

CMD [ "npm", "run", "start:prod" ]
