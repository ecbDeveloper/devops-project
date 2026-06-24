<template>
    <Modal @fechar-modal="outrasInfosStore.setModalOutrasInfosAberto()" >
        <p>Adicionar informação adicional</p>

        <div>
            <span>Descrição</span>
            <InputSelect
                v-model="selectValue.value"
                :erro="selectValue.erro"
                :opcoes="select"
                :storeOpcoes="{
                    store: useOutrasInfosStore,
                    abrirModal: 'setModalOutrasListaInfosAberto'
                }"
            />

            <span>Dados</span>
            <InputTextArea
                v-model="textAreaValeu.value"
                :erro="textAreaValeu.erro"
            />

        </div>
        <div class="butoes">
            <Butao texto="Cancelar" :class="'erro'" @click-botao="outrasInfosStore.setModalOutrasInfosAberto()" />
            <Butao texto="Ok" @click-botao="enviar" />
        </div>
    </Modal>

    <ModalCadastrarOutraListaInformacao v-if="modalListaAberto"/>
</template>

<script setup lang="ts">

import { ModalCadastrarOutraListaInformacao } from '#components'

const funcionarioStore = useFuncionarioStore()
const outrasInfosStore = useOutrasInfosStore()
const alertStore = useAlertStore()
const modalListaAberto = computed(() => outrasInfosStore.getModalOutraListaInfos)

const select = computed(() => {
    return outrasInfosStore.getListaInfos.map(f => {
        return {
            value: f.idfuncionario_listainfo,
            texto: f.descricao
        }
    })
})

const selectValue = reactive({
    value: 0,
    erro: ''
})

const textAreaValeu = reactive({
    value: '',
    erro: ''
})

const enviar = async () => {
    selectValue.erro = ''
    textAreaValeu.erro = ''

    if(selectValue.value <= 0 || !selectValue.value) {
        selectValue.erro = "Campo obrigatorio!"
    }

    if(textAreaValeu.value.length < 1) {
        textAreaValeu.erro = "Campo obrigatorio!"
    }

    if(textAreaValeu.erro.length > 0 || selectValue.erro.length > 0) return

    const json = {
        dado: textAreaValeu.value
    }

    const id_funcionario = funcionarioStore.getFuncionario.id_funcionario
    outrasInfosStore.fetchCadastrarOutrasInfos(id_funcionario, selectValue.value, json).then(() => {
        alertStore.mostrarAlerta('success', "Informações adicionais cadastradas com sucesso!")
        outrasInfosStore.setModalOutrasInfosAberto()
    }).catch(() => {
        alertStore.mostrarAlerta('error', "Não foi realizar o cadastro")
    })
}

const fetchSelect = async () => {

    if(outrasInfosStore.getListaInfos.length == 0) {
        await outrasInfosStore.fetchOutraListaInfos()
    }

}

onMounted(async () => {
    await fetchSelect()
})

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