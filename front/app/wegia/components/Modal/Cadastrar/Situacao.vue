<template>
    <Modal @fechar-modal="fecharModal" >
        <p>Cadastre uma nova situação:</p>
        <InputText v-model="situacao" />
        <div class="butoes">
            <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
            <Butao texto="Ok" @click-botao="enviarSituacao" />
        </div>
    </Modal>
</template>

<script setup lang="ts">

const store = useSituacaoStore()
const alertStore = useAlertStore()

const situacao = ref('')

const enviarSituacao = async () => {
    try {
        await store.fetchCadastrarSituacao({situacao: situacao.value});

        alertStore.mostrarAlerta('success', 'Situação cadastrada com sucesso!')
        fecharModal()
    } catch (e) {
        console.log(e)
    }
}

const fecharModal = () => {
    store.setModalAberto()
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
            height: 40px;
            width: 30%;
        }
    }

}

</style>