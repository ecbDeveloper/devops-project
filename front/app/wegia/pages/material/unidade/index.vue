<template>
  <section class="tabela-unidade">
    <tabela-schema
      titulo="Unidade"
      :isLoading="isLoading"
      :paginacao="unidadesPaginacao"
      :linhas="unidades"
      :cabecalhos="[
          { nome: 'Nome', chave: 'descricao', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarUnidades"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_MATERIAL_UNIDADE)"
          class="cadastrar-unidade"
          texto="Cadastrar Unidade"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-base-cadastro-texto
      v-if="abrirModal"
      :texto="unidadeEditar ? 'Editar Unidade' : 'Cadastrar Unidade'"
      :valorExistente="unidadeEditar?.descricao ?? ''"
      @fechar-modal="toggleAbrirModal"
      @enviar-modal="enviarUnidade"
    />
  </section>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_UNIDADE
})

const materialUnidadeStore = useMaterialUnidadeStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const unidadeEditar = ref<MaterialUnidadeInterface | null>(null)
const abrirModal = ref(false)

const unidadesPaginacao = computed(() => materialUnidadeStore.getUnidades)
const unidades = computed(() => materialUnidadeStore?.getUnidades?.items ?? [])
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_UNIDADE)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: MaterialUnidadeInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  unidadeEditar.value = linha
}

const enviarUnidade = async (descricao: string) => {
  try {

    if(!descricao) return alertStore.mostrarAlerta('error', 'Cadastre um nome de almoxarifado!')

    if(!unidadeEditar.value) {
      await materialUnidadeStore.fetchCadastrarUnidade({ descricao })
    } else {
      await materialUnidadeStore.fetchAtualizarUnidade(unidadeEditar.value.id_unidade, { descricao })
    }

    unidadeEditar.value = null
    abrirModal.value = false
    atualizarPagina.value++

  } catch (e) {
    const err = e as FetchError<ErroApiInterface>

    const mensagemUnico = err.response?._data?.errors?.descricao?.find(
      (msg: string) => msg.includes('único')
    );

    if(mensagemUnico) alertStore.mostrarAlerta('error', 'Esse almoxarifado ja foi cadastrado!')
  }
}

const buscarUnidades = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await materialUnidadeStore.fetchUnidades(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const unidadesLocal = materialUnidadeStore.getUnidades
  if(
    !unidadesLocal.items ||
    unidadesLocal?.items?.length == 0
  ) await buscarUnidades()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-unidade {
  .cadastrar-unidade {
    height: 40px;
    width: 200px;
  }
}

</style>