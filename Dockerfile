FROM node:lts as development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /user/src/app

COPY package*.json ./
COPY prisma ./prisma/
COPY .env ./

RUN npm install
RUN npx prisma db push
RUN npx prisma db seed

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm start