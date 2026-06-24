<template>
    <Modal @fechar-modal="fecharModal" >
        <p>Cadastre uma nova Ocorrencia:</p>
        <FormsVariasSessoes :formulario="formulario" @enviar-formulario="enviar">
            <template #botao>
                <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
            </template>

        </FormsVariasSessoes>
    </Modal>
</template>

<script setup lang="ts">

import { cadastrarOcorrencia, enviarOcorrencia } from '~/forms/Atendido/Ocorrencia'

const props = defineProps({
    id_atendido: {
        type: Number,
        required: true
    }
})

const atendidoStore = useAtendidoStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const formulario = ref(cadastrarOcorrencia)

const enviar = async () => {
    if(!pessoaStore?.getPessoa?.funcionario) {
        alertStore.mostrarAlerta(
            'erro',
            'Você não tem permissão para cadastrar uma ocorrência.'
        )
        fecharModal()
        return
    }

    await enviarOcorrencia(formulario.value, props.id_atendido, pessoaStore.getPessoa.funcionario.id_funcionario)

    fecharModal()
}

const fecharModal = () => {
    atendidoStore.toggleModal()
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