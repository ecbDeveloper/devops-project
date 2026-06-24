<template>
  <section class="tabela-tipos">
    <tabela-schema
      titulo="tipos"
      :isLoading="isLoading"
      :paginacao="tiposPaginacao"
      :linhas="tipos"
      :cabecalhos="[
          { nome: 'Nome', chave: 'nome', ordenavel: true },
          { nome: 'Tipo', chave: 'tipo', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarTipos"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_MATERIAL_TIPO_MOVIMENTACAO)"
          class="cadastrar-tipos"
          texto="Cadastrar Tipos"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-material-tipo-movimentacao
      v-if="abrirModal"
      :titulo="tipoMovimentacaoEditar ? 'Editar Tipo' : 'Cadastrar Tipo'"
      :tipoMovimentacao="tipoMovimentacaoEditar"
      @fechar-modal="toggleAbrirModal"
      @buscar="atualizarPagina++"
    />
  </section>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_TIPO_MOVIMENTACAO
})

const materialTipoMovimentacaoStore = useMaterialTipoMovimentacaoStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const tipoMovimentacaoEditar = ref<MaterialTipoMovimentacaoInterface | null>(null)
const abrirModal = ref(false)

const tiposPaginacao = computed(() => materialTipoMovimentacaoStore.getTipos)
const tipos = computed(() => {
  const tiposLocal = materialTipoMovimentacaoStore?.getTipos?.items

  if(!tiposLocal) return []

  return tiposLocal.map(t => {
    return {
      ...t,
      tipo: t.tipo === 'e' ? 'Entrada' : 'Saida'
    }
  })
})
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_TIPO_MOVIMENTACAO)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: MaterialTipoMovimentacaoInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  tipoMovimentacaoEditar.value = linha
  if(tipoMovimentacaoEditar.value && linha) tipoMovimentacaoEditar.value.tipo = linha.tipo === 'Entrada' ? 'e' : 's'
}

const buscarTipos = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await materialTipoMovimentacaoStore.fetchTipos(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  await buscarTipos()
})

</script>

<style lang="scss" scoped>

.tabela-tipos {
  .cadastrar-tipos {
    height: 40px;
    width: 200px;
  }
}

</style>