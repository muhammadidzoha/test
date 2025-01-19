FROM node:18-alpine AS be_build
WORKDIR /app
COPY ./app/server/package*.json .
RUN npm install
COPY ./app/server .
RUN npm run build

FROM node:18-alpine AS be_prod
WORKDIR /app
COPY ./app/server/package*.json .
RUN npm install --omit=dev
COPY --from=be_build /app/dist .
CMD node dist/index.js
