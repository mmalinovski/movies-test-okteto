FROM node:14

# setup okteto message
COPY bashrc /root/.bashrc

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm NPM_CACHE_FOLDER=/root/.npm npm install

COPY . .
CMD ["npm", "start"]
