FROM node:24-alpine

WORKDIR /app

CMD ["sh", "-c", "\
  npm install && \
  rm -rf /tmp/nitro .nuxt/.cache && \
  npm run dev\
"]