<template>
    <Modal @fechar-modal="fecharModal" >
        <p>Adicionar arquivo</p>
        <div>
            <p>Tipo de arquivo</p>
            <InputSelect
                v-model="selectValue.value"
                :erro="selectValue.erro"
                :opcoes="opcoes"
                :storeOpcoes="{
                    store: usePessoaArquivoStore,
                    abrirModal: 'setModalTipo'
                }"
            />

            <p>Arquivo</p>
            <InputFile v-model="arquivoValue.value" :erro="arquivoValue.erro" :accept="arquivoValue.mimeType" />
        </div>
        <div class="butoes">
            <Butao texto="Cancelar" :class="'erro'" @click-botao="fecharModal" />
            <Butao texto="Ok" @click-botao="enviar" />
        </div>
    </Modal>

    <ModalCadastrarBaseCadastroTexto
        v-if="modalTipoAberto"
        texto="Cadastrar Tipo de arquivo"
        :semPermissao="!pessoaStore.possuiPermissao(Permissao.CRIAR_PESSOA_TIPO_ARQUIVO)"
        @fechar-modal="pessoaArquivoStore.setModalTipo"
        @enviar-modal="enviarTipoDocumento"
    />
</template>

<script setup lang="ts">

defineProps({
    placeholder: String,
})
const emit = defineEmits(['enviar-modal', 'fechar-modal'])

const pessoaArquivoStore = usePessoaArquivoStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const opcoes = computed(() => pessoaArquivoStore.getTiposParaSelect)
const modalTipoAberto = computed(() => pessoaArquivoStore.getModalTipo)

const selectValue = reactive({
    value: 0,
    erro: ''
})

const arquivoValue = reactive({
    value: null,
    erro: '',
    mimeType: 'png|jpg|jpeg|pdf'
})

const enviarTipoDocumento = async (texto: string) => {
    const descricaoNormalizada = texto.trim().toLowerCase()

        const jaExiste = pessoaArquivoStore.getTipos.some(
            (tipo) => tipo.descricao.trim().toLowerCase() === descricaoNormalizada
        )

        if (jaExiste) {
            alertStore.mostrarAlerta('error', "Esse tipo de arquivo já existe!")
            return
        }

    const json = {
        descricao: texto
    }

    await pessoaArquivoStore.cadastrarArquivoTipo(json).then(async () => {
        await pessoaArquivoStore.buscarArquivoTipos()
        pessoaArquivoStore.setModalTipo()
        alertStore.mostrarAlerta('success', "Tipo de arquivo cadastrado com sucesso!")
    }).catch(() => {
        alertStore.mostrarAlerta('error', "Não foi possivel cadastrar o tipo de arquivo.")
    })
}

const enviar = () => {
    selectValue.erro =  ""
    arquivoValue.erro =  ""

    if(selectValue.value == 0) selectValue.erro = "Campo Obrigatorio!"

    if(arquivoValue.value == null) arquivoValue.erro = "Campo Obrigatorio!"

    arquivoValue.erro = ValidateForm.arquivoValidacao(arquivoValue.value, arquivoValue.mimeType, true)

    if(selectValue.erro || arquivoValue.erro) return

    emit('enviar-modal', {arquivo: arquivoValue.value, id_pessoa_tipo_arquivo: selectValue.value})
}

const fecharModal = () => {
    emit('fechar-modal')
}

onMounted(async () => {
    await pessoaArquivoStore.buscarArquivoTipos()
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