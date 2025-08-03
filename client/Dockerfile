FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE ${PORT:-5001}

CMD ["yarn", "start"]