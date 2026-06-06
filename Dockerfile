FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY dist ./dist
ENV PORT=3000
EXPOSE 3000
CMD node dist/server.cjs
