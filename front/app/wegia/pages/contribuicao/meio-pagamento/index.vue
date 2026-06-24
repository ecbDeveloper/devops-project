<template>
  <section class="tabela-meio-pagamento">
    <tabela-schema
      titulo="Gateway"
      :isLoading="isLoading"
      :paginacao="meios"
      :linhas="meios?.items ?? []"
      :cabecalhos="[
          { nome: 'Descrição', chave: 'meio', ordenavel: true },
          { nome: 'Plataforma', chave: 'endPoint', ordenavel: false },
          { nome: 'Status', chave: 'status_descricao', ordenavel: false },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarMeios"
      @editar="toggleAbrirModal"
    />

    <modal-cadastrar-contribuicao-meio-pagamento
      v-if="abrirModal"
      titulo="Editar Meio de pagamento"
      :meio="meioEditar"
      @buscar="atualizarPagina++"
      @fechar-modal="toggleAbrirModal"
    />
  </section>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MEIO_PAGAMENTO_DE_CONTRIBUICAO
})

const pessoaStore = usePessoaStore()
const contribuicaoMeioPagamentoStore = useContribuicaoMeioPagamentoStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const meioEditar = ref<ContribuicaoMeioPagamentoInterface | null>(null)
const abrirModal = ref(false)

const meios = computed(() => {
  const data  = contribuicaoMeioPagamentoStore.getMeios ?? {}
  const items = data.items?.map(item => ({
    ...item,
    status_descricao: item.status ? 'Ativado' : 'Desativado',
    endPoint: `${item.gateway.plataforma}`
  })) ?? []

  return {
    ...data,
    items
  }
})

const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MEIO_PAGAMENTO_DE_CONTRIBUICAO)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: ContribuicaoMeioPagamentoInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  meioEditar.value = linha
}

const buscarMeios = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await contribuicaoMeioPagamentoStore.fetchMeios(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const meiosLocal = contribuicaoMeioPagamentoStore.getMeios
  if(
    !meiosLocal.items ||
    meiosLocal?.items?.length == 0
  ) await buscarMeios()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-meio-pagamento {
  .cadastrar-meio-pagamento {
    height: 40px;
    width: 200px;
  }
}

</style>