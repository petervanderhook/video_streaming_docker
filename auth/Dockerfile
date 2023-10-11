FROM node:14-alpine

WORKDIR /app

COPY . .

RUN ls -la ./

RUN npm install

RUN mv ./login.html /app/public

EXPOSE 3000

CMD ["npm", "start"]

