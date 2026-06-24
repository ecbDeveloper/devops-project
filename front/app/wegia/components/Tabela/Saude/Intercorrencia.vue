<template>
  <section class="tabela-saude-intercorrencia">
    <tabela-schema
      titulo="Comorbidades"
      orderByStart="data"
      tipoOrderByStart="DESC"
      :isLoading="isLoading"
      :paginacao="intercorrenciaPaginacao"
      :linhas="intercorrencias"
      :cabecalhos="[
          { nome: 'Funcionário', chave: 'nome', ordenavel: false },
          { nome: 'Data', chave: 'data', ordenavel: true }
      ]"
      :atualizacao="atualizarPagina"
      :mostrarFiltros=false
      @click-linha="toggleModalDetalhado"
      @buscar="buscarIntercorrencias"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_INTERCORRENCIA)"
          class="cadastrar-intercorrencia"
          texto="Cadastrar Intercorrencia"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>
  </section>

  <modal-cadastrar-saude-intercorrencia
    v-if="abrirModal"
    :id_fichamedica="fichaId"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

  <modal-saude-intercorrencia-detalhes
    v-if="intercorrenciaAberta"
    :intercorrencia="intercorrenciaAberta"
    @fechar-modal="toggleModalDetalhado"
    @buscar="buscarIntercorrencias"
  />

</template>

<script setup lang="ts">


const props = defineProps<{
  fichaId: number
}>()

const saudeIntercorrenciaStore = useSaudeIntercorrenciaStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const intercorrenciaAberta = ref<SaudeIntercorrenciaInterface | null>(null)
const abrirModal = ref(false)

const intercorrenciaPaginacao = computed(() => saudeIntercorrenciaStore.getIntercorrencias)
const intercorrencias = computed(() => {
  if(!saudeIntercorrenciaStore.getIntercorrencias?.items?.length) return []

  return saudeIntercorrenciaStore.getIntercorrencias.items.map(s => {
    return {
      ...s,
      nome: s.funcionario?.pessoa?.nome
    }
  })
})

const toggleModalDetalhado = (intercorrencia: SaudeIntercorrenciaInterface | null = null) => { intercorrenciaAberta.value = intercorrencia }
const toggleAbrirModal = () => { abrirModal.value = !abrirModal.value }

const buscarIntercorrencias = async (params: Partial<SaudeSinalVitalBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeIntercorrenciaBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await saudeIntercorrenciaStore.fetchIntercorrencias(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const intercorrencias = saudeIntercorrenciaStore.getIntercorrencias
  if(
    !intercorrencias.items ||
    intercorrencias?.items?.length == 0 ||
    intercorrencias?.items[0].id_fichamedica != props.fichaId
  ) await buscarIntercorrencias({ ordenacao: 'data', tipoOrdenacao: 'DESC' })

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-intercorrencia {
  .cadastrar-intercorrencia {
    height: 40px;
    width: 200px;
  }
}

</style>