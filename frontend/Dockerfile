FROM node:14 as dev

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN --mount=type=cache,target=./node_modules/.cache/webpack npm run build

FROM nginx:alpine
COPY --from=dev /usr/src/app/public /usr/share/nginx/html
EXPOSE 80
