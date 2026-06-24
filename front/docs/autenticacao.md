# Autenticação

## Fluxo de login

1. `pages/login.vue` coleta `cpf` e `senha`.
2. Chama `authStore.fetchLogin(credenciais)`.
3. `AuthService.login` envia `POST /auth/login`.
4. Em sucesso:
   - token salvo em cookie (`salvarTokenCookie`)
   - `pessoaStore.setPessoa(data.pessoa)`
   - redireciona para `/`

## Armazenamento de sessão

Arquivo: `utils/authCookie.ts`

- Cookie: `auth`
- Expiração calculada por `expira_em` retornado pela API
- `sameSite: 'strict'`

## Logout

`authStore.fetchSair`:

- `AuthService.logout()`
- remove cookie (`removerTokenCookie`)
- limpa pessoa logada
- redireciona para `/login`

## Proteção de sessão

`middleware/auth.global.ts`:

- bloqueia rotas privadas sem cookie
- permite lista de rotas públicas
- redireciona usuário autenticado de `/login` para `/`

## Header e sessão

`components/Header/index.vue` exibe:

- dados da pessoa logada
- ação de troca de senha
- ação de logout

Veja também [Permissões](permissoes.md).
