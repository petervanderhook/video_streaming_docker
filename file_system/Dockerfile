# Ubuntu file system Dockerfile
FROM node:14-alpine

# Create a shared directory for the file system
RUN mkdir /mnt/data

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4100

CMD ["npm", "start"]

# Expose the shared directory as a volume
VOLUME /mnt/data


