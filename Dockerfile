FROM node:20.10.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]