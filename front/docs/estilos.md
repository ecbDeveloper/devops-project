# Estilos

## Stack de estilo

- Sass (`.scss`)
- Variáveis e mixins globais
- CSS global em `assets/scss/default.scss`

## Organização

- `assets/scss/_variables.scss`: cores e fontes
- `assets/scss/_responsive.scss`: breakpoints via mixins (`sm`, `md`, `lg`, `xl`, `xxl`)
- `assets/scss/default.scss`: reset/base e utilitários globais

`nuxt.config.ts` injeta SCSS global e `additionalData` para variáveis/mixins.

## Consistência visual

- componentes usam variáveis SCSS (`$color-primary`, etc.)
- design responsivo mobile-first com mixins
- tipografia principal definida por variáveis (`Open Sans`, `Montserrat`, `Inter`)

