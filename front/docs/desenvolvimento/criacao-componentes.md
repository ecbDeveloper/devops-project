# Criação de Componentes

## Quando criar componente novo

Crie componente novo quando a lógica/estrutura for reutilizável ou específica de domínio com complexidade própria.

## Passo a passo recomendado

1. Verificar se já existe base equivalente em `components/`.
2. Criar em subpasta coerente (`Input`, `Modal`, `Tabela`, `Forms`, `Section`, etc.).
3. Tipar `props` e `emits`.
4. Usar variáveis/mixins SCSS globais.
5. Integrar em página via store (não chamar service diretamente).

## Padrões úteis do projeto

- Eventos no formato `click-botao`, `fechar-modal`, `enviar-formulario`
- Componentes base como `Modal`, `Butao`, `Input`, `Tabela`

## Exemplo de referência

- `components/Modal/index.vue`
- `components/Input/index.vue`
- `components/Section/SimplesForm.vue`
