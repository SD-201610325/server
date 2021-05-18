FROM node:14-alpine

RUN mkdir -p /server
WORKDIR /server

COPY . .
RUN npm install -g

EXPOSE 3000

CMD ["npm", "start"]