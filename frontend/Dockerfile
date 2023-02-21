FROM node:alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm i
RUN npx tsc --jsx react
RUN npm run build

CMD ["npm", "run", "start"]
