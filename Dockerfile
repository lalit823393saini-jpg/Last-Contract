FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY server.js ./
ENV NODE_ENV=production PORT=2567
EXPOSE 2567
CMD ["npm","start"]
