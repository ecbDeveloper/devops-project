# Hooks/Composables

## Composables identificados

- `use-http.ts`: cliente HTTP principal com auth header
- `use-http-pagar-me.ts`: cliente para Pagar.me
- `use-cep.ts`: cliente para ViaCEP

## Papel de cada um

- Definir baseURL por ambiente
- Normalizar URL client/server
- Centralizar headers comuns

## Exemplo

```ts
const config = useRuntimeConfig()
const baseURL = config.public.BASE_URL_API_WEGIA
const url = process.client ? `/api-wegia${endpoint}` : `${baseURL}/api${endpoint}`
```
