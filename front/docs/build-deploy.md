# Build e Deploy

## Build de aplicação

No frontend (`app/wegia`):

```bash
npm run build
```

Saída padrão Nuxt 3: `.output/`.

## Docker de desenvolvimento

- Arquivo: `app/Dockerfile`
- Comportamento: instala dependências e executa `npm run dev`

## Docker Compose

`docker-compose.yml` na raiz sobe serviço `app`:

- porta `3000:3000`
- volume `./app/wegia:/app`
- `NODE_ENV=development`
- rede externa `wegia-network`

## Docker de produção (multi-stage)

Arquivo raiz `Dockerfile`:

1. Stage builder (`node:24-alpine`): `npm install` + `npm run build`
2. Stage runtime (`alpine` + `nodejs` + `nginx`)
3. Copia `.output`, templates Nginx e script de entrypoint

## Nginx e entrypoint

- `app/config/default.conf` usa `envsubst` para injetar variáveis
- proxys para `/api-wegia/`, `/api/upload/`, `/api-pagar-me/`
- `app/config/custom-entrypoint.sh` inicia Nginx e servidor Nuxt (`node /app/.output/server/index.mjs`)

