# Guia de Instalação

## Pré-requisitos

- Docker e Docker Compose
- Opcional para execução fora de container: Node.js (recomendado: série 24, alinhado aos Dockerfiles)

## Estrutura relevante

- Projeto frontend: `app/wegia`
- Compose de desenvolvimento: `docker-compose.yml` (raiz)
- Docker de desenvolvimento: `app/Dockerfile`

## Instalação de dependências

### Via Docker (fluxo recomendado pelo projeto)

```bash
docker compose build
docker compose up
```

Com isso, o frontend sobe em `http://localhost:3000`.

### Via Node local (sem Docker)

```bash
cd app/wegia
npm install
npm run dev -- --host 0.0.0.0
```

## Configuração de ambiente

Use como base `app/wegia/.env.example`.

Variáveis obrigatórias estão em [Variáveis de Ambiente](variaveis-ambiente.md).

## Execução em desenvolvimento

Script usado: `npm run dev` (`nuxt dev --host 0.0.0.0`).

## Build de produção

```bash
cd app/wegia
npm run build
npm run start
```

## Comandos úteis do `package.json`

- `npm run dev`: desenvolvimento
- `npm run build`: build de produção
- `npm run start`: executa build
- `npm run generate`: geração estática Nuxt
- `npm run preview`: preview de build
- `npm run postinstall`: `nuxt prepare`
