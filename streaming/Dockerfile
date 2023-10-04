FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./streaming.html /app/public

EXPOSE 3000

CMD ["npm", "start"]

