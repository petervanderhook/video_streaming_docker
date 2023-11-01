FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD mv ./stream.html /app/public

EXPOSE 4000

CMD ["npm", "start"]

