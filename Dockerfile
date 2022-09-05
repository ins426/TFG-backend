FROM node:16.16

WORKDIR /home/node

COPY . .

RUN npm install @mapbox/node-pre-gyp -g
RUN npm install
RUN npm install pm2 -g
RUN npm i express jsonwebtoken dotenv
RUN npm i --save-dev nodemon
RUN npm i bcrypt

EXPOSE 8080

CMD ["pm2-runtime", "app.js", ".pm2/process.js"]