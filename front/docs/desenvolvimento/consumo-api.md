# Consumo de API

## Fluxo oficial do projeto

- Componente/Página -> Store -> Service -> Composable HTTP

## Implementação

1. Criar/atualizar interface de contrato (`interface/`).
2. Criar método no service do domínio.
3. Criar ação na store para consumo do método.
4. Chamar a ação na página/componente.

## Exemplo real

```ts
// service/FuncionarioService.ts
async buscarFuncionarios(queryString = {}) {
  return await useHttp(`/funcionario?${queryString}`)
}
```

```ts
// stores/Funcionario/funcionarioStore.ts
async fetchFuncionarios(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const { data } = await FuncionarioService.buscarFuncionarios(queryString)
  this.funcionariosPaginacao = data
}
```

## Boas práticas

- Evitar `fetch` direto em componente
- Manter serialização (`JSON.stringify`) quando necessário
- Usar `FormData` para upload
