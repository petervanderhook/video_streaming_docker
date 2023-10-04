FROM node:14-alpine

WORKDIR /app


COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

COPY ./upload.html /app/public

EXPOSE 3000

CMD ["npm", "start"]

