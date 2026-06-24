<template>
  <section class="tabela-parceiro">
    <tabela-schema
      titulo="Unidade"
      :isLoading="isLoading"
      :paginacao="parceirosPaginacao"
      :linhas="parceiros"
      :cabecalhos="[
          { nome: 'Nome', chave: 'nome', ordenavel: true },
          { nome: 'CPF', chave: 'cpf', ordenavel: true },
          { nome: 'CNPJ', chave: 'cnpj', ordenavel: true },
          { nome: 'Telefone', chave: 'telefone', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarParceiros"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_MATERIAL_ORIGEM_SAIDA)"
          class="cadastrar-parceiro"
          texto="Cadastrar Origem/Saida"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-material-parceiro
      v-if="abrirModal"
      :titulo="parceiroEditar ? 'Editar Parceiro' : 'Cadastrar Parceiro'"
      :parceiro="parceiroEditar"
      @fechar-modal="toggleAbrirModal"
      @buscar="atualizarPagina++"
    />
  </section>

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_ORIGEM_SAIDA
})


const materialParceiroStore = useMaterialParceiroStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const parceiroEditar = ref<MaterialParceiroInterface | null>(null)
const abrirModal = ref(false)

const parceirosPaginacao = computed(() => materialParceiroStore.getParceiros)
const parceiros = computed(() => materialParceiroStore?.getParceiros?.items ?? [])
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_ORIGEM_SAIDA)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: MaterialParceiroInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  parceiroEditar.value = linha
}

const buscarParceiros = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await materialParceiroStore.fetchParceiros(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const parceirosLocal = materialParceiroStore.getParceiros
  if(
    !parceirosLocal.items ||
    parceirosLocal?.items?.length == 0
  ) await buscarParceiros()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-parceiro {
  .cadastrar-parceiro {
    height: 40px;
    width: 200px;
  }
}

</style>