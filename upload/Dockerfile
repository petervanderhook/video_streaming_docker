FROM node:14-alpine

WORKDIR /app

COPY . .

CMD ["mv", "upload.html", "/app/public/upload.html"]

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
