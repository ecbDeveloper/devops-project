# 🎉 Bem-vindo ao README para Desenvolvedores

Este README oferece uma visão geral das tecnologias utilizadas, como rodar o projeto localmente e explicações técnicas detalhadas sobre a estrutura do projeto.

## 🛠️ Tecnologias utilizadas

* Nuxt 3
* Pinia 3
* Fontawesome
* Docker
* Nginx
* Sass

## 🚀 Como rodar o projeto

Para rodarmos o projeto localmente, precisamos apenas rodar o [docker-compose.yml](./docker-compose.yml). No terminal dentro do projeto execute os seguintes comandos:

``` bash

docker compose build
docker compose up

```

Apos isso, o projeto estara rodando na porta [3000](http://localhost:3000).

### 🔧 O que acontece ao rodar o projeto:

1. **Dockerfile**
    - Instala as dependências necessárias do ambiente.
    - Adiciona o arquivo do **Nginx**[(nginx.conf)](./wegia/config/nginx.conf) e o **script de entrada** [(custom-entrypoint.sh)](./wegia/config/custom-entrypoint.sh) no projeto.
    - Chama o script `custom-entrypoint.sh` para iniciar a aplicação de forma apropriada.
    
2. **Custom-entrypoint**
    - Verifica se o ambiente é de **desenvolvimento**.
        - Localmente ele executa `npm install` e `npm run dev`.
        - Demais ambiente ira executar o `npm run start`
    - O **Nginx** é configurado localmente para simular o servidor de produção, se necessário.

## 🎨 Estilos (CSS/Sass)

### 🔑 Configuração de Sass

O projeto utiliza Sass para configurar os estilos, aproveitando variáveis e mixins para manter o código limpo e reutilizável.

Essas variaveis se encontram dentro da pasta [scss](./wegia/assets/scss).

### 🌈 Variáveis de CSS

Dentro do arquivo **sass** [(css-variables.scss)](./wegia/assets/scss/css-variables.scss), definimos variáveis para cores, fontes, etc. Exemplo:

``` vue

<style lang="scss">
    
    p {
        color: $color-primary;
        font-family: $font-primary
    }

</style>

```

### 📱 Mixins Responsivos

Os mixins são configurados com o padrão **mobile-first**, ou seja, o estilo é focado para dispositivos móveis e adapta-se conforme o tamanho da tela. Exemplo de uso de mixins responsivos:

``` vue

<style lang="scss">
    
    .container {
        width: 100%;
        margin: 0 auto;
        padding: 0 10px; 

        @include md {
            max-width: 768px;
            padding: 0 20px;
        }
    }

</style>


``` 

## 🏗️ Estrutura do Projeto

### ⚙️ Layouts

Na pasta `layouts`, definimos o layout padrão da aplicação. Podemos ter diferentes layouts e escolher qual será utilizado em cada página, permitindo flexibilidade no design.

### 🧩 Stores

Usamos o **Pinia** para o gerenciamento de estado centralizado. As variáveis de estado global e as chamadas ao servidor são armazenadas aqui, permitindo acesso fácil e reatividade.

### 🔌 Composables

A pasta **composables** contém funções reutilizáveis que lidam com a comunicação com o back-end. As chamadas à API devem ser feitas aqui para garantir uma abordagem modular e reutilizável.

# Documentação

- [Nuxt 3](https://nuxt.com/)
- [Pinia 3](https://pinia.vuejs.org/)
- [Sass](https://sass-lang.com/)
- [UseCookie](https://nuxt.com/docs/api/composables/use-cookie)