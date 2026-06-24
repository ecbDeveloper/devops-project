<template>
    <div class="login">
        <div class="login-text-image">
            <img :src="logoUrl" alt="Logo Wegia">
            <div>
                <h2>CONHEÇA</h2>
                <p>{{ conheca?.paragrafo }}</p>
            </div>
            <div class="objetivo">
                <h2>OBJETIVO</h2>
                <p>{{ objetivo?.paragrafo }}</p>
            </div>
        </div>
        <div class="login-box">
            <div class="login-header">
                <img :src="logoUrl" alt="Logo Wegia">
                <div>
                   <h2>{{ titulo?.paragrafo }}</h2>
                   <h3>{{ subtitulo?.paragrafo }}</h3>
                </div>
            </div>
            <form @submit.prevent="enviarFormulario">
                <Input type="text" placeholder="Usuário" icon="fas fa-user" v-model="credenciais.cpf" />
                <Input type="password" placeholder="Senha" icon="fas fa-lock" v-model="credenciais.senha" />
                <Butao texto="Entrar" type="submit" />
            </form>
        </div>
    </div>
    <footer>
        <p>{{ footer?.paragrafo }}</p>
    </footer>
</template>

<script setup lang="ts">

definePageMeta({
  layout: false
});

const authStore                         = useAuthStore()
const configuracaoCampoImagemStore      = useConfiguracaoCampoImagemStore()
const configuracaoSelecaoParagrafoStore = useConfiguracaoSelecaoParagrafoStore()

const credenciais = reactive({
    cpf: '',
    senha: ''
})

const logoUrl   = computed(() => configuracaoCampoImagemStore.getCampoImagemLogoUrl)
const titulo    = computed(() => configuracaoSelecaoParagrafoStore.getTitulo)
const subtitulo = computed(() => configuracaoSelecaoParagrafoStore.getSubtitulo)
const footer    = computed(() => configuracaoSelecaoParagrafoStore.getRodape)
const conheca   = computed(() => configuracaoSelecaoParagrafoStore.getConheca)
const objetivo  = computed(() => configuracaoSelecaoParagrafoStore.getObjetivo)

const enviarFormulario = () => {
    authStore.fetchLogin(credenciais)
}


</script>

<style scoped lang="scss">

.login {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;

    @include md {
        align-items: initial;
        display: grid;
        grid-template-columns: 1fr 1fr;
        justify-content: inherit;
    }

    .login-text-image {
        display: none;
        position: relative;
        background-color: rgba(0, 0, 0, 0.672);
        padding: 48px 96px;

        @include md {
            display: block;
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('@/assets/img/background-wegia.jpg');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            opacity: 0.5;
            z-index: -1;
        }

        img {
            margin: auto;
            width: 50%;
        }

        div > h2 {
            color: $color-tertiary;
            font-family: $font-tertiary;
            font-size: 32px;
            margin: 20px 0;
        }

        div > p {
            color: $color-tertiary;
            font-family: $font-tertiary;
        }

        .objetivo {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
    }

    .login-box {
        background-color: $color-secondary;
        border-radius: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 360px;
        margin: auto;
        padding: 24px;
        width: 360px;

        .login-header {
            display: flex;
            align-items: center;

            img {
                height: 70px;
                margin-right: 24px;
                width: 120px;
            }

            h2 {
                font-size: 20px;
            }
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
}

footer {
    background: $color-quaternary;
    padding: 8px;

    p {
        color: $color-white;
        font-size: 10px;
    }
}

</style>