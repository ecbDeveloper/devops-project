<template>
    <SectionTabelaFiltroPaginacao
        :cabecalhos="[
            {nome: 'Descrição', chave: 'descricao', ordenavel: true},
            {nome: 'Dado', chave: 'dado', ordenavel: true},
            {nome: 'Ação', chave: 'acao', ordenavel: true}
        ]"
        :linhas="outrasInfos"
        :acao=acoes
        :orderBy="opcoesOrderBy"
        :buscar="opcoesBuscar"
        :itensPorPagina="opcoesItensPorPagina"
        :paginaAtual="opcoesPaginaAtual"
        :ultimaPagina="opcoesUltimaPagina"
        :totalItens="opcoesTotalItens"
        :textoBotao="textoBotao"
        :botaoAparecer="pessoaStore.possuiPermissao(Permissao.CRIAR_OUTRAS_INFORMACOES_FUNCIONARIO)"
        @click-botao="outrasInfosStore.setModalOutrasInfosAberto"
        @excluir="excluirOpcao"
        @update:pagina-atual="opcoesPaginaAtual = $event"
        @update:buscar="opcoesBuscar = $event"
        @update:itens-por-pagina="opcoesItensPorPagina = $event"
        @update:order-by="opcoesOrderBy = $event"
    />

    <ModalCadastrarOutraInformacao v-if="modalOutraInformacao" />
</template>

<script setup lang="ts">

const props = defineProps({
    id_funcionario: {
        type: Number,
        required: true
    }
})

const outrasInfosStore = useOutrasInfosStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const outrasInfos = computed(() => {
    const items = outrasInfosStore.getOutrasInfosPaginacao.items

    if (!items) return []


    return items.map(f => {
        return {
            id: f.idfunncionario_outrasinfo,
            descricao: f.lista_info,
            dado: f.dado
        }
    })
})

const acoes = computed(() => {
    const a = []

    if(pessoaStore.possuiPermissao(Permissao.DELETAR_OUTRAS_INFORMACOES_FUNCIONARIO)) {
        a.push('deletar')
    }

    return a
})

const modalOutraInformacao = computed(() => outrasInfosStore.getModalOutrasInfosAberto)

const opcoesItensPorPagina = ref(10)
const opcoesPaginaAtual = ref(1)
const opcoesUltimaPagina = ref(1)
const opcoesTotalItens = ref(1)
const opcoesBuscar = ref('')
const opcoesOrderBy = ref({orderBy: "descricao", tipoOrderBy: 'ASC'})

const textoBotao = computed(() => {
    return window.document.documentElement.clientWidth < 768 ? '+' : 'Adicionar Informações'
})

const excluirOpcao = async (opcao: {id: number, descricao: string, dados: string}) => {

    try {
        await outrasInfosStore.fetchDeletarOutrasInfos(opcao.id);
        await buscarOutrasInformacoes()
        alertStore.mostrarAlerta('success', "Item excluido com sucesso!")
    } catch (e) {
        alertStore.mostrarAlerta('error', "Erro ao tentar excluir!")
    }
}

const buscarOutrasInformacoes = async () => {
    const propsLocal : any = {}

    if(opcoesBuscar.value) propsLocal.buscar = opcoesBuscar.value
    if(opcoesOrderBy.value.orderBy) propsLocal.ordenacao = opcoesOrderBy.value.orderBy
    if(opcoesOrderBy.value.tipoOrderBy) propsLocal.tipoOrdenacao = opcoesOrderBy.value.tipoOrderBy
    propsLocal.pagina = opcoesPaginaAtual.value
    propsLocal.itensPorPagina = opcoesItensPorPagina.value

    await outrasInfosStore.fetchOutrasInfos(props, props.id_funcionario).then(() => {
        const outrasInfosLocal = outrasInfosStore.getOutrasInfosPaginacao

        opcoesItensPorPagina.value = outrasInfosLocal.itensPorPagina
        opcoesPaginaAtual.value = outrasInfosLocal.paginaAtual
        opcoesUltimaPagina.value = outrasInfosLocal.totalPaginas
        opcoesTotalItens.value = outrasInfosLocal.totalItens

    })
}

watch(
    () => outrasInfosStore.getOutrasInfos, async () => {
        await buscarOutrasInformacoes()
    }
)

watch([opcoesItensPorPagina, opcoesPaginaAtual, opcoesBuscar, opcoesOrderBy], async () => {
    await buscarOutrasInformacoes()
})

onMounted(async () => {
    const outrasInfosLocal = outrasInfosStore.getOutrasInfosPaginacao

    if(
        (!outrasInfosLocal.items || !outrasInfosLocal.items.length) &&
        outrasInfosLocal.paginaAtual !== 1) {
        await buscarOutrasInformacoes()
    }
})

</script>