FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD sh -c "sleep 20 && npx prisma migrate deploy && npx prisma db seed && npm run dev"