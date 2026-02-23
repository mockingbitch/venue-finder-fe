# Development image: chạy next dev với hot reload
FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package.json package-lock.json* ./

# Cài đặt toàn bộ dependencies (kể cả devDependencies)
RUN npm install

# Copy source sẽ được mount qua volume khi chạy docker-compose
COPY . .

# Entrypoint: khi volume mount ghi đè /app, node_modules có thể trống → cài lại
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Polling để container nhận thay đổi file từ volume (Docker trên Mac/Windows)
ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]
