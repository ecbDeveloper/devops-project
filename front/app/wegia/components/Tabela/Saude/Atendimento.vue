<template>
  <section class="tabela-saude-exames">
    <tabela-schema
      :isLoading="isLoading"
      titulo="Comorbidades"
      :paginacao="atendimentosCompleto"
      :linhas="atendimentos"
      :cabecalhos="[
          { nome: 'Medico', chave: 'nome', ordenavel: true },
          { nome: 'Data do atendimento', chave: 'data_atendimento', ordenavel: true }
      ]"
      :atualizacao="atualizarPagina"
      @click-linha="toggleModalDetalhado"
      @buscar="buscarExames"
    >

      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_ATENDIMENTO) && pessoaStore.possuiPermissao(Permissao.VISUALIZAR_MEDICO)"
          class="cadastrar-exames"
          texto="Cadastrar Atendimento"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>
  </section>

  <modal-cadastrar-saude-atendimento
    v-if="modalAberto"
    :id_fichamedica="fichaId"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

  <modal-saude-atendimento-detalhes
    v-if="atendimentoAberto"
    :atendimento="atendimentoAberto"
    @fechar-modal="toggleModalDetalhado"
  />

</template>

<script setup lang="ts">


const props = defineProps<{
  fichaId: number
}>()

const saudeAtendimentoStore = useSaudeAtendimentoStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const atendimentoAberto = ref<SaudeAtendimentoInterface | null>(null)
const modalAberto = ref(false)

const atendimentosCompleto = computed(() => saudeAtendimentoStore.getAtendimentos)
const atendimentos = computed(() => {
  const atendimentosLocal = saudeAtendimentoStore.getAtendimentos

  if(!atendimentosLocal?.items?.length) return []

  return atendimentosLocal.items.map((item : SaudeAtendimentoInterface) => {
    return {
      ...item,
      nome: item?.medico?.nome
    }
  })
})

const toggleAbrirModal = () => { modalAberto.value = !modalAberto.value }

const toggleModalDetalhado = (atendimento: SaudeAtendimentoInterface | null = null) => { atendimentoAberto.value = atendimento }

const buscarExames = async (params: Partial<SaudeAtendimentoBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeAtendimentoBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await saudeAtendimentoStore.fetchAtendimentos(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const atendimentos = saudeAtendimentoStore.getAtendimentos
  if(
    !atendimentos.items ||
    atendimentos?.items?.length == 0 ||
    atendimentos?.items[0]?.id_fichamedica != props.fichaId
  ) await buscarExames()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-exames {
  .cadastrar-exames {
    height: 40px;
    width: 200px;
  }
}

</style>