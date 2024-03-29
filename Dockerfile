FROM node:12-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start::debug

