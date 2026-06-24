<template>
<h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_FUNCIONARIO_ARQUIVO)">Você não possui permissão!</h2>

<SectionTabelaFiltroPaginacao
        :cabecalhos="[
            { nome: 'Arquivo', chave: 'nome_docfuncional', ordenavel: true },
            { nome: 'Data', chave: 'data', ordenavel: true },
            { nome: 'Ação', chave: 'acao', ordenavel: false },
        ]"
        :linhas="documentos"
        :acao="acoes"
        :orderBy="orderBy"
        :buscar="buscar"
        :itensPorPagina="itensPorPagina"
        :paginaAtual="paginaAtual"
        :ultimaPagina="ultimaPagina"
        :totalItens="totalItens"
        :textoBotao="textoBotao"
        :botaoAparecer="pessoaStore.possuiPermissao(Permissao.CRIAR_FUNCIONARIO_ARQUIVO)"
        @click-botao="documentoStore.setModal"
        @baixar="baixar"
        @excluir="excluir"
        @update:pagina-atual="paginaAtual = $event"
        @update:buscar="buscar = $event"
        @update:itens-por-pagina="itensPorPagina = $event"
        @update:order-by="orderBy = $event"
        @atualizar-todos-filtros="atualizarTodosFiltros"
        v-if="pessoaStore.possuiPermissao(Permissao.VISUALIZAR_FUNCIONARIO_ARQUIVO)"
/>


<ModalCadastrarFuncionarioArquivo v-if="modalAberto" @enviar-modal="enviarArquivo" @fechar-modal="documentoStore.setModal" />
</template>

<script setup lang="ts">

import { baixarImagem } from '~/utils/imagem'

const props = defineProps({
    id_funcionario: {
        type: Number,
        required: true
    }
})

const documentoStore = useDocumentoStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const modalAberto = computed(() => documentoStore.getModalAberto)

const documentos = computed(() => {
    const items = documentoStore.getDocumentos.items

    if (!items) return []

    return items
})
const acoes = computed(() => {
    const a = ['baixar']

    if(pessoaStore.possuiPermissao(Permissao.DELETAR_FUNCIONARIO_ARQUIVO)) {
        a.push('deletar')
    }

    return a
})

const orderBy = ref({orderBy: 'arquivo', tipoOrderBy: 'ASC'})
const buscar = ref('')
const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(10)

const textoBotao = computed(() => {
    return window.document.documentElement.clientWidth < 768 ? '+' : 'Adicionar Arquivo'
})

const baixar = (dados: any) => {
    baixarImagem(dados.arquivo, dados.extensao_arquivo, dados.nome_arquivo)
}

const excluir = (dado: {id_fundocs: number}) => {
    documentoStore.fetchDeletarDocumento(dado.id_fundocs).then(async () => {
        await buscarDocumentos()
        alertStore.mostrarAlerta('success', 'Documento deletado com sucesso!')
    }).catch(() => {
        alertStore.mostrarAlerta('error', 'Erro ao deletar documento!')
    })
}

const enviarArquivo = async (dados: {arquivo: File, id_docfuncional: number}) => {
    const formData = new FormData();
    formData.append('arquivo', dados.arquivo)
    formData.append('id_docfuncional', dados.id_docfuncional)

    await documentoStore.fetchCadastrarDocumento(formData, props.id_funcionario).then(async () => {
        await buscarDocumentos()
        alertStore.mostrarAlerta('success', 'Documento cadastrado com sucesso!')
        documentoStore.setModal()
    }).catch(() => {
        alertStore.mostrarAlerta('erro', 'Erro ao cadastrar documento!')
    })
}

const buscarDocumentos = async () => {
    await documentoStore.fetchDocumentos(props.id_funcionario, {
        buscar:  buscar.value,
        itensPorPagina: itensPorPagina.value,
        pagina: paginaAtual.value,
        ordenacao: orderBy.value.orderBy,
        tipoOrdenacao: orderBy.value.tipoOrderBy
    }).then(() => {
        const docLocal = documentoStore.getDocumentos

        itensPorPagina.value = docLocal.itensPorPagina
        paginaAtual.value = docLocal.paginaAtual
        ultimaPagina.value = docLocal.totalPaginas
        totalItens.value = docLocal.totalItens
    })
}

const atualizarTodosFiltros = async (filtros: any) => {
    buscar.value = filtros.busca
    itensPorPagina.value = filtros.itensPorPagina
    orderBy.value = {
        orderBy: filtros.orderBy,
        tipoOrderBy: filtros.tipoOrderBy
    }
}

watch([buscar, itensPorPagina, paginaAtual, orderBy], async () => {
    await buscarDocumentos()
})

onMounted(async () => {

    if(
        !documentoStore.getDocumentos.items ||
        documentoStore.getDocumentos.items[0].id_funcionario !== props.id_funcionario ||
        documentoStore.getDocumentos.paginaAtual !== 1
    ) {
        await buscarDocumentos()
    }
})

</script>