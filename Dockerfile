FROM node:16.16

WORKDIR /home/node

COPY . .

RUN npm install @mapbox/node-pre-gyp -g
RUN npm install
RUN npm install pm2 -g

EXPOSE 8080

CMD ["pm2-runtime","app.js","process.js"]


