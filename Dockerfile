FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

ENV DB_HOST mysql
ENV DB_USER root
ENV DB paperspace
ENV DB_PASSWORD root

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]