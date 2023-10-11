FROM node:14-alpine

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY ./streaming.html /app/public/
COPY ./app.js /app/

EXPOSE 4000

CMD ["npm", "start"]

