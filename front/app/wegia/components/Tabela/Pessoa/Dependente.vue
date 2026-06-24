<template>
<h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_DEPENDENTE)">Você não possui permissão!</h2>

<SectionTabelaFiltroPaginacao
    v-else
    :cabecalhos="[
        { nome: 'Nome', chave: 'nome', ordenavel: true },
        { nome: 'Parentesco', chave: 'parentesco', ordenavel: true },
        { nome: 'Ação', chave: 'acao', ordenavel: false }
    ]"
    :linhas="dependentes"
    :acao="['editar', 'deletar']"
    :orderBy="orderBy"
    :buscar="buscar"
    :itensPorPagina="itensPorPagina"
    :paginaAtual="paginaAtual"
    :ultimaPagina="ultimaPagina"
    :totalItens="totalItens"
    :textoBotao="textoBotao"
    :botaoAparecer="pessoaStore.possuiPermissao(Permissao.CRIAR_DEPENDENTE)"
    @click-botao="dependenteStore.setModal"
    @editar="editar"
    @excluir="excluir"
    @update:pagina-atual="paginaAtual = $event"
    @update:buscar="buscar = $event"
    @update:itens-por-pagina="itensPorPagina = $event"
    @update:order-by="orderBy = $event"
/>

<ModalCadastrarPessoaDependente
    @fechar-modal="fecharModal"
    :id_pessoa="pessoa.id_pessoa"
    v-if="modal"
/>

</template>

<script setup lang="ts">

const props = defineProps({
    pessoa: {
        type: Object as () => PessoaInterface,
        required: true
    }
})

const router = useRouter()
const alertStore = useAlertStore()
const dependenteStore = useDependenteStore()
const pessoaStore = usePessoaStore()

const dependentes = computed(() =>  {
    const items = dependenteStore.getDependentes.items

    if(!items) return []

    return items.map(d => {
        return {
            id_dependente: d.id_dependente,
            nome: d.dependente?.nome,
            parentesco: d.parentesco
        }
    })
})
const modal = computed(() => dependenteStore.getModal)

const orderBy = ref({orderBy: 'nome', tipoOrderBy: 'ASC'})
const buscar = ref('')
const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(10)

const textoBotao = computed(() => {
    return window.document.documentElement.clientWidth < 768 ? '+' : 'Adicionar Informações'
})


const excluir = async (dados : {id_dependente: number}) => {
    await dependenteStore.fetchDeletarDependente(dados.id_dependente).then(() => {
        alertStore.mostrarAlerta('success', "Deletado com sucesso!")
        buscarDependentes()
    }).catch(() => {
        alertStore.mostrarAlerta('error', "Erro ao deletar!")
    })
}

const editar = async (dados : {id_dependente: number}) => {
    router.push('/dependente/' + dados.id_dependente)
}

const buscarDependentes = async () => {

    const params: any = {}

    if(buscar.value) params.buscar = buscar.value
    if(orderBy.value.orderBy) params.ordenacao = orderBy.value.orderBy
    if(orderBy.value.tipoOrderBy) params.tipoOrdenacao = orderBy.value.tipoOrderBy
    params.pagina = paginaAtual.value
    params.itensPorPagina = itensPorPagina.value
    params.with = 'dependente'

    await dependenteStore.fetchDependentes(props.pessoa.id_pessoa, params).then(() => {
        const depLocal = dependenteStore.getDependentes

        itensPorPagina.value = depLocal.itensPorPagina
        paginaAtual.value = depLocal.paginaAtual
        ultimaPagina.value = depLocal.totalPaginas
        totalItens.value = depLocal.totalItens
    })
}

const fecharModal = async () => {
    await buscarDependentes()
    dependenteStore.setModal()
}

watch([buscar, itensPorPagina, paginaAtual, orderBy], async () => {
    await buscarDependentes()
})

onMounted(async () => {
    await buscarDependentes()
})

</script>

<style scoped lang="scss">


</style>