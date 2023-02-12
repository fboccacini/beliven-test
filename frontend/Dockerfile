FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npx tsc
RUN npm run build
CMD ["npm", "run", "start"]