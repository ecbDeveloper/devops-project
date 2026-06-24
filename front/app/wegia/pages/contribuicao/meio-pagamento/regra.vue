<template>
  <section class="tabela-regra-meio-pagamento">
    <tabela-schema
      titulo="Gateway"
      :isLoading="isLoading"
      :paginacao="regrasMeiosPagamento"
      :linhas="regrasMeiosPagamento?.items ?? []"
      :cabecalhos="[
          { nome: 'Meio de Pagamento', chave: 'meio', ordenavel: true },
          { nome: 'Plataforma', chave: 'endPoint', ordenavel: false },
          { nome: 'Regra', chave: 'regra_nome', ordenavel: false },
          { nome: 'Valor', chave: 'valor', ordenavel: true },
          { nome: 'Status', chave: 'status_descricao', ordenavel: false },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarRegrasMeioPagamento"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_REGRAS_PAGAMENTO_DE_CONTRIBUICAO)"
          class="cadastrar-regra-meio-pagamento"
          texto="Cadastrar Regra"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-contribuicao-regra-meio-pagamento
      v-if="abrirModal"
      :titulo="meioEditar ? 'Editar Regra' : 'Cadastrar Nova Regra'"
      :meio="meioEditar"
      @buscar="atualizarPagina++"
      @fechar-modal="toggleAbrirModal"
    />
  </section>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_REGRAS_PAGAMENTO_DE_CONTRIBUICAO
})

const pessoaStore = usePessoaStore()
const contribuicaoRegraStore = useContribuicaoRegraStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const meioEditar = ref<ContribuicaoMeioPagamentoInterface | null>(null)
const abrirModal = ref(false)

const regrasMeiosPagamento = computed(() => {
  const data  = contribuicaoRegraStore.getRegraMeioPagamento ?? {}
  const items = data.items?.map(item => ({
    ...item,
    meio: item.meio_pagamento.meio,
    status_descricao: item.status ? 'Ativado' : 'Desativado',
    endPoint: `${item.meio_pagamento.gateway.plataforma}`,
    regra_nome: item?.regra?.regra ? item.regra.regra : 'Sem regra',
  })) ?? []

  return {
    ...data,
    items
  }
})

const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_REGRAS_PAGAMENTO_DE_CONTRIBUICAO)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: ContribuicaoMeioPagamentoInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  meioEditar.value = linha
}

const buscarRegrasMeioPagamento = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await contribuicaoRegraStore.fetchRegraMeioPagamento(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const regrasMeioLocal = contribuicaoRegraStore.getRegraMeioPagamento
  if(
    !regrasMeioLocal.items ||
    regrasMeioLocal?.items?.length == 0
  ) await buscarRegrasMeioPagamento()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-regra-meio-pagamento {
  .cadastrar-regra-meio-pagamento {
    height: 40px;
    width: 200px;
  }
}

</style>