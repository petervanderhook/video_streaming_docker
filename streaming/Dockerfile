FROM node:14-alpine

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY ./streaming.html /app/public/

EXPOSE 3000

CMD ["npm", "start"]

