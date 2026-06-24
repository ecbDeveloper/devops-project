<template>
    <Modal @fechar-modal="fecharModal" >

        <h2 class="sem-permissao" v-if="semPermissao">Você não possui permissão!</h2>
        <div v-else>
            <p v-if="texto">{{ texto }}</p>
            <Input v-model="valor" :type="type" :placeholder="placeholder" />
            <div class="butoes">
                <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
                <Butao texto="Ok" @click-botao="enviar" />
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">

const props = defineProps({
    texto: String,
    placeholder: String,
    semPermissao: {
        type: Boolean,
        default: false
    },
    valorExistente: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    }
})

const valor = ref(props.valorExistente)
const emit = defineEmits(['enviar-modal', 'fechar-modal'])

const enviar = async () => {
    emit('enviar-modal', valor.value)
}

const fecharModal = () => {
    emit('fechar-modal')
}

</script>

<style lang="scss">

.modal  {
    width: 720px;

    p {
        margin-bottom: 24px;
        font-size: 20px;
    }

    .butoes {
        justify-content: flex-end;
        display: flex;
        gap: 16px;

        button {
            width: 30%;
            height: 40px;
        }
    }

}

</style>