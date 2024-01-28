FROM node:20-alpine
WORKDIR /opt/app
ADD . .
RUN npm install
RUN npm run build
CMD ["node", "./dist/main.js"]