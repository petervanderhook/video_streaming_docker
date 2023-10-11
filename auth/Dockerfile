FROM node:14-alpine


WORKDIR /app

COPY ./package.json /app/package.json

RUN npm install

COPY ./login.html /app/public/login.html
COPY ./app.js /app/public/app.js
COPY ./fail.html /app/public/fail.html
COPY ./garylarson.jpg /app/public/images/garylarson.jpg

EXPOSE 3000

CMD ["npm", "start"]

