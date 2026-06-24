<template>
  <section class="tabela-socio">

    <div class="container-botoes">
      <i v-if="pessoaStore.possuiPermissao(Permissao.VISUALIZAR_SOCIO_ANIVERSARIANTE)" class="fa fa-birthday-cake" @click="abrirModalAniversario = true"></i>
      <i v-if="pessoaStore.possuiPermissao(Permissao.VISUALIZAR_SOCIO_GRAFICO)" class="fa fa-chart-area" @click="abrirModalGrafico = true"></i>
    </div>

    <tabela-schema
      titulo="Tag"
      :isLoading="isLoading"
      :paginacao="socios"
      :linhas="socios?.items ?? []"
      :cabecalhos="cabecalhos"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarSocios"
      @editar="toggleEditar"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.VISUALIZAR_GATEWAY_DE_CONTRIBUICAO)"
          class="cadastrar-socio"
          texto="Cadastrar Socio"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

  </section>

  <modal-cadastrar-socio
    v-if="abrirModal"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

  <modal-atualizar-socio
    v-if="socioEditar"
    :socio="socioEditar"
    @fechar-modal="toggleEditar"
    @buscar="atualizarPagina++"
  />

  <modal-socio-aniversariantes
    v-if="abrirModalAniversario"
    @fechar-modal="abrirModalAniversario = false"
  />

  <modal-socio-grafico-tipo
    v-if="abrirModalGrafico"
    @fechar-modal="abrirModalGrafico = false"
  />


</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_SOCIO
})

const pessoaStore = usePessoaStore()
const socioStore = useSocioStore()

const isLoading             = ref(true)
const atualizarPagina       = ref(1)
const socioEditar           = ref<SocioInterface | null>(null)
const abrirModal            = ref(false)
const abrirModalAniversario = ref(false)
const abrirModalGrafico     = ref(false)

const cabecalhos = computed(() => {
  const c = [
    { nome: 'Nome', chave: 'nome', ordenavel: true },
    { nome: 'Email', chave: 'email', ordenavel: true },
    { nome: 'Telefone', chave: 'telefone', ordenavel: false },
    { nome: 'Endereco', chave: 'endereco', ordenavel: false },
    { nome: 'CPF/CNPJ', chave: 'cpf', ordenavel: true },
  ]

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_SOCIO)) c.push({ nome: 'Ações', chave: 'acao', ordenavel: false })

  return c
})

const socios = computed(() => {
  const s = socioStore?.getSocios ?? {}

  const items = s.items?.map((item) => {
    return {
      ...item,
      nome: item.pessoa.nome,
      cpf: FormatarParaForm.formatarCpfOuCnpj(item.pessoa.cpf),
      telefone: item.pessoa.telefone,
      endereco: item.pessoa.logradouro
    }
  })

  return {
    ...s,
    items: items
  }
})

const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_SOCIO)) a.push('editar')

  return a
})

const toggleEditar = (linha: SocioInterface | null) => { socioEditar.value = linha }

const toggleAbrirModal = () => { abrirModal.value = !abrirModal.value }

const buscarSocios = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await socioStore.fetchSocios(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const sociosLocal = socioStore.getSocios
  if(
    !sociosLocal.items ||
    sociosLocal?.items?.length == 0
  ) await buscarSocios()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-socio {
  .cadastrar-socio {
    height: 40px;
    width: 200px;
  }

  .container-botoes {
    display: flex;
    gap: 24px;
    justify-content: flex-start;
    padding: 15px 48px;

    i {
      border: 2px dashed $color-secondary;
      border-radius: 8px;
      color: $color-primary;
      cursor: pointer;
      font-size: 24px;
      padding: 16px;
    }
  }
}

</style>