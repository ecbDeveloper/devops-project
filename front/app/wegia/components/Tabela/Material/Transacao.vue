<template>
  <section class="tabela-saude-entrada">
    <tabela-schema
      titulo="Produtos"
      :isLoading="isLoading"
      :paginacao="transacaoPaginacao"
      :linhas="transacoes"
      :cabecalhos="[
          { nome: 'Almoxarifado', chave: 'descricao_almoxarifado', ordenavel: true },
          { nome: 'Origem', chave: 'nome_parceiro', ordenavel: false },
          { nome: 'Tipo', chave: 'descricao_tipo_movimentacao', ordenavel: true },
          { nome: 'Responsavel', chave: 'nome_responsavel', ordenavel: false },
          { nome: 'Valor Total', chave: 'valor_total', ordenavel: false },
          { nome: 'Data', chave: 'data', ordenavel: true },
      ]"
      :atualizacao="atualizarPagina"
      @buscar="buscarTransacoes"
      @click-linha="toggleModal"
    >
    </tabela-schema>
  </section>

  <modal-material-detalhe-transacao
    v-if="transacaoAberta"
    :isLoading="isLoading"
    :transacao="transacaoAberta"
    @fechar-modal="toggleModal"
    @buscar="atualizarPagina++"
  />

</template>

<script setup lang="ts">

import { TipoMovimentacaoEnum } from '~/constants/Material/TipoMovimentacaoEnum'

const props = defineProps<{
  tipo?: TipoMovimentacaoEnum
}>()

const materialTransacaoStore = useMaterialTransacaoStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const transacaoAberta = ref<MaterialTransacaoInterface | null>(null)

const transacaoPaginacao = computed(() => materialTransacaoStore.getTransacoes)
const transacoes = computed(() => {
  if(!materialTransacaoStore.getTransacoes?.items?.length) return []

  return materialTransacaoStore.getTransacoes.items.map(t => {
    const valorTotal = t.transacao_produto
      .reduce((total: number, item: {valor_unitario: string, quantidade: number}) => total + (item.quantidade * Number(item.valor_unitario)), 0)


    return {
      ...t,
      nome_responsavel: t.responsavel.nome,
      nome_parceiro: t.parceiro.nome,
      descricao_almoxarifado: t.almoxarifado.descricao,
      descricao_tipo_movimentacao: t.tipo_movimentacao.nome,
      valor_total: `R$ ${valorTotal.toFixed(2).replace('.', ',')}`
    }
  })
})

const buscarTransacoes = async (params: Partial<MaterialTransacaoBuscarPaginadoParamsInterface> = {}) => {
  const paramsLocal: Partial<MaterialTransacaoBuscarPaginadoParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(props.tipo) paramsLocal.tipo                            = props.tipo


  isLoading.value = true
  await materialTransacaoStore.fetchTransacao(paramsLocal)
  isLoading.value = false
}

const toggleModal = (transacao: MaterialTransacaoInterface | null = null) => {
  transacaoAberta.value = transacao
}

onMounted(async () => {
  const produtosLocal = materialTransacaoStore.getTransacoes
  if(
    !produtosLocal.items ||
    produtosLocal?.items?.length == 0
  ) await buscarTransacoes()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-entrada {
  .cadastrar-entrada {
    height: 40px;
    width: 200px;
  }
}

</style>