<template>
    <div class="simples-form">
        <h2 class="titulo" v-if="titulo">{{ titulo }}</h2>

        <form>
            <slot />

            <div class="botoes">
                <slot name="botao" />
                <Butao
                    :texto="textoBotao"
                    :bloqueado="bloqueado"
                    class="botao"
                    @click-botao="handleClick"
                />
            </div>
        </form>

    </div>
</template>

<script setup lang="ts">

defineProps({
    titulo: String,
    textoBotao: {
        type: String,
        default: 'Enviar'
    },
    bloqueado: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['enviar-formulario']);

const handleClick = () => {
  emit('enviar-formulario');
};

</script>

<style lang="scss">

.simples-form {
    .titulo {
        background-color: $color-tertiary;
        border-top-left-radius: 24px;
        border-top-right-radius: 24px;
        padding: 24px;
    }

    form {
        background-color: $color-white;
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        display: flex;
        flex-direction: column;
        min-height: 120px;
        padding: 24px;

        .botoes {
            align-items: center;
            display: flex;
            flex-direction: row;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 24px;

            button {
                align-self: flex-end;
                font-weight: 700;
                height: 40px;
                text-transform: capitalize;
                padding: 0 8px;
                width: auto;
            }
        }

    }
}

</style>