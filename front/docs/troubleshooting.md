# Troubleshooting

## 1) API não responde no frontend

Verifique:

- `BASE_URL_API_WEGIA` no `.env`
- proxy do Nuxt (`nuxt.config.ts`) e Nginx (`app/config/default.conf`)
- backend acessível pela URL configurada

## 2) Redirecionamento constante para `/login`

Verifique:

- presença/validade do cookie `auth`
- retorno de `POST /auth/login`
- expiração do token (`expira_em`)

## 3) Erro na contribuição (gateway)

Verifique:

- `PUBLIC_KEY_PAGAR_ME`
- `BASE_URL_API_PAGAR_ME`
- payload enviado em `ContribuicaoGatewayPagarMeService`

## 4) CEP não preenche endereço

Verifique:

- `BASE_URL_API_CEP`
- disponibilidade da API ViaCEP

## 5) Docker Compose falha com rede externa

`docker-compose.yml` exige rede `wegia-network` já criada.

```bash
docker network create wegia-network
```

## 6) Build sobe, mas API de upload falha

Confirme proxy de `/api/upload/` em:

- `nuxt.config.ts`
- `app/config/default.conf`
