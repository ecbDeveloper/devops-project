#!/bin/sh

export $(grep -v '^#' /app/.env | xargs)

envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

nginx

node /app/.output/server/index.mjs