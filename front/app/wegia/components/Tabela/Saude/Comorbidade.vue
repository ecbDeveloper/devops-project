<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_ENFERMIDADE)">Você não possui permissão!</h2>
  <section class="tabela-saude-comorbidade">
    <tabela-schema
      :isLoading="isLoading"
      titulo="Comorbidades"
      :paginacao="comorbidadesCompleta"
      :linhas="comorbidades"
      :cabecalhos="[
          { nome: 'Data Diagnostico', chave: 'data_diagnostico', ordenavel: true },
          { nome: 'CID', chave: 'CID', ordenavel: true },
          { nome: 'Descrição', chave: 'descricao', ordenavel: true },
          { nome: 'Status', chave: 'statusLocal', ordenavel: false },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acao"
      :atualizacao="atualizarPagina"
      @buscar="buscarComorbidades"
      @editar="toggleAbrirModal"
    >

      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_ENFERMIDADE) && pessoaStore.possuiPermissao(Permissao.VISUALIZAR_CID)"
          class="cadastrar-comorbidade"
          texto="Cadastrar Comorbidade"
          @click-botao="toggleAbrirModal"
        />
      </template>

      <template #filtro>
        <div class="filtro-busca">
          <InputSelect
              v-model="status"
              opcaoDefault="Todos Status"
              :opcoes="[
                { texto: 'Ativo', value: 1 },
                { texto: 'Inativo', value: 0 }
              ]"
              @select-change="atualizarPagina++"
          />
        </div>
      </template>
    </tabela-schema>
  </section>

  <modal-cadastrar-saude-comorbidade
    v-if="modalAberto"
    :comorbidade="comorbidadeEditar"
    :id_fichamedica="fichaId"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

</template>

<script setup lang="ts">


const props = defineProps<{
  fichaId: number
}>()

const saudeComorbidadeStore = useSaudeComorbidadeStore()
const pessoaStore = usePessoaStore()

const comorbidadeEditar = ref<SaudeComorbidadeInterface | null>(null)
const isLoading = ref(true)
const status = ref<string | number>('')
const atualizarPagina = ref(1)
const modalAberto = ref(false)

const comorbidadesCompleta = computed(() => saudeComorbidadeStore.getComorbidades)
const comorbidades = computed(() => {
  const comorbidadesLocal = saudeComorbidadeStore.getComorbidades

  if(!comorbidadesLocal?.items?.length) return []

  return comorbidadesLocal.items.map((item : SaudeComorbidadeInterface) => {
    return {
      ...item,
      statusLocal: item.status == 1 ? 'Ativo' : 'Inativo',
      CID: item?.cid?.CID,
      descricao: item?.cid?.descricao
    }
  })
})
const acao = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_ENFERMIDADE) ) a.push('editar')

  return a
})

const toggleAbrirModal = (comorbidade: SaudeComorbidadeInterface | null = null) => {
  comorbidadeEditar.value = comorbidade
  modalAberto.value = !modalAberto.value
}

const buscarComorbidades = async (params: Partial<SaudeComorbidadeBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeComorbidadeBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao
  if(status.value !== '') paramsLocal.status                 = String(status.value)

  isLoading.value = true
  await saudeComorbidadeStore.fetchComorbidades(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const comorbidadesLocal = saudeComorbidadeStore.getComorbidades
  if(
    !comorbidadesLocal.items ||
    comorbidadesLocal?.items?.length == 0 ||
    comorbidadesLocal?.items[0]?.id_fichamedica != props.fichaId
  ) await buscarComorbidades()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-comorbidade {
  .cadastrar-comorbidade {
    height: 40px;
    width: 200px;
  }
}

</style>