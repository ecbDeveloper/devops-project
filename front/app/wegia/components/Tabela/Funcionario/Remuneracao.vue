<template>

<SectionTabelaFiltroPaginacao 
    :cabecalhos="[
        { nome: 'Remuneração', chave: 'descricao' },
        { nome: 'Início', chave: 'inicio' },
        { nome: 'Fim', chave: 'fim' },
        { nome: 'Valor', chave: 'valor' },
        { nome: 'Ação', chave: 'acao' }
    ]" 
    :linhas="remuneracoes"
    :acao="['deletar']"
    :orderBy="orderBy"
    :buscar="buscar"
    :itensPorPagina="itensPorPagina"
    :paginaAtual="paginaAtual"
    :ultimaPagina="ultimaPagina"
    :totalItens="totalItens"
    textoBotao="Adicionar Remuneração"
    @click-botao="remuneracaoStore.setModal"
    @excluir="excluir"
    @update:pagina-atual="paginaAtual = $event"
    @update:buscar="buscar = $event"
    @update:itens-por-pagina="itensPorPagina = $event"
    @update:order-by="orderBy = $event"
/>

<ModalCadastrarRemuneracao
    v-if="modalRemuneracao"
    @cadastrado=buscarRemuneracoes
/>

</template>

<script setup lang="ts">

const props = defineProps({
    id_funcionario: {
        type: Number,
        required: true
    }
})

const remuneracaoStore = useRemuneracaoStore()
const alertStore = useAlertStore()

const remuneracao = computed(() => remuneracaoStore.getRemuneracao)
const remuneracoes = computed(() => {
    const items = remuneracaoStore.remuneracoes.items

    if (!items) return []

    return items.map(r => {
        return {
            funcionario_id_funcionario: r.funcionario_id_funcionario,
            idfuncionario_remuneracao: r.idfuncionario_remuneracao,
            fim: r.fim,
            inicio: r.inicio,
            descricao: r.tipo.descricao,
            valor: r.valor
        }
    })
})
const modalRemuneracao = computed(() => remuneracaoStore.getModalAberto)

const orderBy = ref({orderBy: 'descricao', tipoOrderBy: 'ASC'})
const buscar = ref('')
const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(10)

const buscarRemuneracoes = async () => {
    await remuneracaoStore.fetchRemuneraca(props.id_funcionario, {
        buscar:  buscar.value,
        itensPorPagina: itensPorPagina.value,
        pagina: paginaAtual.value,
        ordenacao: orderBy.value.orderBy,
        tipoOrdenacao: orderBy.value.tipoOrderBy
    }).then(() => {
        const remuneracaoLocal = remuneracaoStore.getRemuneracoes

        itensPorPagina.value = remuneracaoLocal.itensPorPagina
        paginaAtual.value = remuneracaoLocal.paginaAtual
        ultimaPagina.value = remuneracaoLocal.totalPaginas
        totalItens.value = remuneracaoLocal.totalItens
    })
}

const excluir = async (remuneracao: {idfuncionario_remuneracao: number}) => {
    await remuneracaoStore.fetchDeletarRemuneracao(remuneracao.idfuncionario_remuneracao).then(() => {
        alertStore.mostrarAlerta('success', 'Remuneração excluida com sucesso!')
        buscarRemuneracoes()
    }).catch(() => {
        alertStore.mostrarAlerta('error', 'Erro ao excluir remuneração!')
    })
}

watch([buscar, itensPorPagina, paginaAtual, orderBy, remuneracao], async () => {
    await buscarRemuneracoes()
})

onMounted(async () => {
    if(
        (remuneracaoStore.getRemuneracoes.items && !remuneracaoStore.getRemuneracoes.items.length) ||
        remuneracaoStore.getRemuneracoes.paginaAtual != 1 ||
        remuneracaoStore.getRemuneracoes.items[0].funcionario_id_funcionario != props.id_funcionario
    ) await buscarRemuneracoes()
})

</script>