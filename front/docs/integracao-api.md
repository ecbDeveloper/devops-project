# Integração com API

## Clientes HTTP

- `composables/use-http.ts`: API principal WeGIA
- `composables/use-http-pagar-me.ts`: API Pagar.me
- `composables/use-cep.ts`: ViaCEP

## Configuração de baseURL e proxy

`nuxt.config.ts` define:

- runtimeConfig público (`BASE_URL_API_WEGIA`, `BASE_URL_API_CEP`, `BASE_URL_API_PAGAR_ME`, `PUBLIC_KEY_PAGAR_ME`)
- proxy Vite para `/api-wegia`, `/api/upload/` e `/api-pagar-me`

## Headers e autenticação

`use-http.ts` injeta header `Authorization` com token armazenado no cookie `auth`.

## Interceptors

!!! info
    Não foram identificados interceptors globais (Axios/fetch hook) com tratamento centralizado de request/response.

## Exemplo real de consumo

```ts
// service/AuthService.ts
async login(body: AuthLoginInterface) {
  return await useHttp(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
```

## Como consumir novos endpoints

1. Adicionar método no service do domínio.
2. Tipar request/response em `interface/`.
3. Encapsular regra de tela na store.
4. Chamar ação da store na página/componente.

Fluxo completo: [Serviços](servicos.md) e [Estado](estado.md).
