FROM node:14-alpine

WORKDIR /app

COPY . .

RUN ls -la ./

RUN npm install

COPY ./login.html /app/public/login.html

EXPOSE 3000

CMD ["npm", "start"]

