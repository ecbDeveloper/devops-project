# Estrutura do Projeto

## Diretórios principais (`app/wegia`)

- `pages/`: rotas Nuxt (arquivos `.vue`)
- `components/`: componentes reutilizáveis (Input, Tabela, Modal, Header, Menu, Forms)
- `layouts/`: layout padrão da aplicação (`default.vue`)
- `middleware/`: proteção global e por permissão
- `stores/`: estado Pinia por domínio
- `service/`: serviços HTTP por domínio
- `composables/`: clientes HTTP (`use-http`, `use-http-pagar-me`, `use-cep`)
- `forms/`: estruturas declarativas de campos e submissão
- `utils/`: validação, máscara, transformação de payload, cookie de auth
- `interface/`: tipagem TypeScript
- `constants/`: constantes de negócio, incluindo permissões
- `assets/`: SCSS e imagens internas
- `public/`: arquivos públicos (`favicon.ico`, `robots.txt`)

## Arquivos de entrada e configuração

- `app.vue`: shell global (Alert, Layout, Page) e carregamento de configurações visuais
- `nuxt.config.ts`: runtimeConfig, proxy Vite, módulos, CSS global, auto-imports
- `package.json`: scripts de execução/build e dependências
- `.env.example`: variáveis necessárias

## Arquivos importantes para onboarding

- `middleware/auth.global.ts`
- `middleware/permissao.ts`
- `stores/authStore.ts`
- `stores/pessoaStore.ts`
- `composables/use-http.ts`
- `service/Base/BaseService.ts`
- `utils/ValidateForm.ts`
- `mixins/menuConfigMixin.ts`

Consulte também [Padrões de Código](desenvolvimento/padroes-codigo.md).
