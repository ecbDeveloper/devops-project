# Variáveis de Ambiente

## Fonte

Referência oficial do frontend: `app/wegia/.env.example`.

## Variáveis identificadas

- `BASE_URL_API_WEGIA`: URL base da API WeGIA
- `BASE_URL_API_WEGIA_PATH`: caminho base usado no proxy Nginx (ex.: `/api/`)
- `BASE_URL_API_PAGAR_ME`: URL da API Pagar.me
- `PUBLIC_KEY_PAGAR_ME`: chave pública usada na tokenização de cartão
- `BASE_URL_API_CEP`: URL da API ViaCEP

## Exemplo

```env
BASE_URL_API_WEGIA=
BASE_URL_API_WEGIA_PATH=/api/

BASE_URL_API_PAGAR_ME=https://api.pagar.me/core/v5
PUBLIC_KEY_PAGAR_ME=

BASE_URL_API_CEP=https://viacep.com.br/ws
```
