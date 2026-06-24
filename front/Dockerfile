FROM node:24-alpine AS builder

WORKDIR /app

COPY ./app/wegia ./

RUN npm install
RUN npm run build

FROM alpine:latest

RUN apk add --no-cache nodejs npm nginx bash gettext

WORKDIR /app

COPY --from=builder /app/.output .output
COPY ./app/config/default.conf /etc/nginx/conf.d/default.conf.template
COPY ./app/config/nginx.conf /etc/nginx/nginx.conf.template
COPY ./app/config/custom-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
