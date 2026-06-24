# Bem-vindo à Documentação do Frontend WeGIA

## Visão geral

Esta documentação descreve a implementação real do frontend localizado em `app/wegia`, construído com **Nuxt 3**, **Vue 3**, **Pinia** e **Sass**.

O objetivo é acelerar onboarding de novos desenvolvedores com foco em estrutura, fluxo de autenticação/permissão, rotas, estado, integração com API e padrões de desenvolvimento adotados no código atual.

## Objetivo do sistema

O frontend implementa a interface administrativa e pública do WeGIA para módulos como:

- autenticação e sessão;
- gestão de pessoas, funcionários, atendidos e dependentes;
- pets e saúde;
- materiais/patrimônio;
- memorandos;
- sócios e contribuições;
- configurações do sistema.

## Tecnologias identificadas no projeto

- Nuxt `^3.15.4`
- Vue `latest`
- Pinia `^3.0.1` com `@pinia/nuxt`
- Sass `^1.85.1`
- Font Awesome (CDN em `nuxt.config.ts`)
- Docker + Docker Compose
- Nginx (proxy e runtime em container)

## Como a documentação está organizada

- **Fundamentos**: [Instalação](instalacao.md), [Arquitetura](arquitetura.md), [Estrutura](estrutura-projeto.md)
- **Aplicação**: [Rotas](rotas.md), [Páginas](paginas.md), [Layouts](layouts.md), [Componentes](componentes.md)
- **Domínio técnico**: [Serviços](servicos.md), [Integração API](integracao-api.md), [Estado](estado.md), [Autenticação](autenticacao.md), [Permissões](permissoes.md)
- **Qualidade de desenvolvimento**: [Formulários e Validações](formularios-validacoes.md), [Tratamento de Erros](tratamento-erros.md), [Boas Práticas](boas-praticas.md), [Troubleshooting](troubleshooting.md)
- **Guias de execução**: seção [Desenvolvimento](desenvolvimento/padroes-codigo.md)

!!! info
    Se algum padrão não existir no código atual, isso é indicado explicitamente na seção correspondente.
