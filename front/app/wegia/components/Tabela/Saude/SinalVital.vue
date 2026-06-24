<template>
  <section class="tabela-saude-sinal-vital">
    <tabela-schema
      titulo="Comorbidades"
      orderByStart="data"
      tipoOrderByStart="DESC"
      :isLoading="isLoading"
      :paginacao="sinalVitalPaginacao"
      :linhas="sinaisVitais"
      :cabecalhos="[
          { nome: 'Funcionário', chave: 'nome', ordenavel: false },
          { nome: 'Data', chave: 'data', ordenavel: true },
          { nome: 'Saturação', chave: 'saturacao', ordenavel: true },
          { nome: 'Pressão Arterial', chave: 'pressao_arterial', ordenavel: true },
          { nome: 'Frequencia Cardiaca', chave: 'frequencia_cardiaca', ordenavel: true },
          { nome: 'Frequencia Respiratoria', chave: 'frequencia_respiratoria', ordenavel: true },
          { nome: 'Temperatura', chave: 'temperatura', ordenavel: true },
          { nome: 'HGT', chave: 'hgt', ordenavel: true }
      ]"
      :atualizacao="atualizarPagina"
      @buscar="buscarSinaisVitais"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_SINAIS_VITAIS)"
          class="cadastrar-sinal-vital"
          texto="Cadastrar Sinal Vital"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>
  </section>

  <modal-cadastrar-saude-sinal-vital
    v-if="abrirModal"
    :id_fichamedica="fichaId"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

</template>

<script setup lang="ts">


const props = defineProps<{
  fichaId: number
}>()

const saudeSinalVitalStore = useSaudeSinalVitalStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const abrirModal = ref(false)

const sinalVitalPaginacao = computed(() => saudeSinalVitalStore.getSinaisVitais)
const sinaisVitais = computed(() => {
  if(!saudeSinalVitalStore.getSinaisVitais?.items?.length) return []

  return saudeSinalVitalStore.getSinaisVitais.items.map(s => {
    return {
      ...s,
      nome: s.funcionario?.pessoa?.nome
    }
  })
})

const toggleAbrirModal = () => { abrirModal.value = !abrirModal.value }

const buscarSinaisVitais = async (params: Partial<SaudeSinalVitalBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeSinalVitalBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await saudeSinalVitalStore.fetchSinaisVitais(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const sinaisVitais = saudeSinalVitalStore.getSinaisVitais
  if(
    !sinaisVitais.items ||
    sinaisVitais?.items?.length == 0 ||
    sinaisVitais?.items[0].id_fichamedica != props.fichaId
  ) await buscarSinaisVitais({ ordenacao: 'data', tipoOrdenacao: 'DESC' })

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-sinal-vital {
  .cadastrar-sinal-vital {
    height: 40px;
    width: 200px;
  }
}

</style>