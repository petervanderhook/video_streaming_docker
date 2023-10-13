FROM node:14-alpine

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY ./upload.html /app/public/
COPY ./app.js /app/

EXPOSE 3500

CMD ["npm", "start"]

