<template>
  <section class="tabela-saude-alergias">
    <tabela-schema
      titulo="Alergias"
      :isLoading="isLoading"
      :paginacao="alergiasPaginacao"
      :linhas="alergias"
      :cabecalhos="[
          { nome: 'Nome', chave: 'nome', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarAlergias"
      @excluir="excluirAlergia"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CADASTRAR_ALERGIA_NA_FICHA_MEDICA) && pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ALERGIA)"
          class="cadastrar-alergias"
          texto="Cadastrar Alergia"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>
  </section>

  <modal-cadastrar-saude-alergia
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

const saudeAlergiaStore = useSaudeAlergiaStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const abrirModal = ref(false)

const alergiasPaginacao = computed(() => saudeAlergiaStore.getFichaMedicaAlergias)
const alergias = computed(() => {
  if(!saudeAlergiaStore.getFichaMedicaAlergias?.items?.length) return []

  return saudeAlergiaStore.getFichaMedicaAlergias.items.map(s => {
    return {
      ...s,
      nome: s.alergias?.nome
    }
  })
})
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.CADASTRAR_ALERGIA_NA_FICHA_MEDICA)) a.push('deletar')

  return a
})

const toggleAbrirModal = () => { abrirModal.value = !abrirModal.value }

const excluirAlergia = async (alergia : SaudeFichaMedicaAlergiaInterface) => {
  try {
    await saudeAlergiaStore.fetchFichaMedicaAlergiasDeletar(alergia.id_fichamedica_alergia)
    atualizarPagina.value++
    alertStore.mostrarAlerta('success', 'Alergia deletada com sucesso!')
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao deletar alergia!')
  }
}

const buscarAlergias = async (params: Partial<SaudeFichaMedicaAlergiaBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeFichaMedicaAlergiaBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await saudeAlergiaStore.fetchFichaMedicaAlergias(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const alergiasLocal = saudeAlergiaStore.getFichaMedicaAlergias
  if(
    !alergiasLocal.items ||
    alergiasLocal?.items?.length == 0 ||
    alergiasLocal?.items[0].id_fichamedica != props.fichaId
  ) await buscarAlergias()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-alergias {
  .cadastrar-alergias {
    height: 40px;
    width: 200px;
  }
}

</style>