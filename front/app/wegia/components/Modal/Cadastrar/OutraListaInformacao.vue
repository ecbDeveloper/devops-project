<template>
    <Modal @fechar-modal="fecharModal" >
        <p>Cadastre um novo tipo de informação na lista:</p>
        <InputText v-model="texto" />
        <div class="butoes">
            <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
            <Butao texto="Ok" @click-botao="enviar" />
        </div>
    </Modal>
</template>

<script setup lang="ts">

const store = useOutrasInfosStore()
const alertStore = useAlertStore()

const texto = ref('')

const enviar = async () => {
    try {
        await store.fetchCadastrarOutraListaInfos({descricao: texto.value});

        alertStore.mostrarAlerta('success', 'Cadastro realizado com sucesso!')
        fecharModal()
    } catch (e) {
        console.log(e)
    }
}

const fecharModal = () => {
    store.setModalOutrasListaInfosAberto()
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