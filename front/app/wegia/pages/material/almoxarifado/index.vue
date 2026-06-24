<template>
  <section class="tabela-almoxarifado">
    <tabela-schema
      titulo="Almoxarifado"
      :isLoading="isLoading"
      :paginacao="almoxarifadoPaginacao"
      :linhas="almoxarifado"
      :cabecalhos="[
          { nome: 'Nome', chave: 'descricao', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarAlmoxarifado"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_MATERIAL_ALMOXARIFADO)"
          class="cadastrar-almoxarifado"
          texto="Cadastrar Almoxarifado"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-base-cadastro-texto
      v-if="abrirModal"
      :texto="almoxarifadoEditar ? 'Editar Almoxarifado' : 'Cadastrar Almoxarifado'"
      :valorExistente="almoxarifadoEditar?.descricao ?? ''"
      @fechar-modal="toggleAbrirModal"
      @enviar-modal="enviarAlmoxarifado"
    />
  </section>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_ALMOXARIFADO
})

const materialAlmoxarifadoStore = useMaterialAlmoxarifadoStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const almoxarifadoEditar = ref<MaterialAlmoxarifadoInterface | null>(null)
const abrirModal = ref(false)

const almoxarifadoPaginacao = computed(() => materialAlmoxarifadoStore.getAlmoxarifados)
const almoxarifado = computed(() => materialAlmoxarifadoStore?.getAlmoxarifados?.items ?? [])
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_ALMOXARIFADO)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: MaterialAlmoxarifadoInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  almoxarifadoEditar.value = linha
}

const enviarAlmoxarifado = async (descricao: string) => {
  try {

    if(!descricao) return alertStore.mostrarAlerta('error', 'Cadastre um nome de almoxarifado!')

    if(!almoxarifadoEditar.value) {
      await materialAlmoxarifadoStore.fetchCadastrarAlmoxafarifado({ descricao })
    } else {
      await materialAlmoxarifadoStore.fetchAtualizarAlmoxafarifado(almoxarifadoEditar.value.id_almoxarifado, { descricao })
    }

    almoxarifadoEditar.value = null
    abrirModal.value = false
    await buscarAlmoxarifado()

  } catch (e) {
    const err = e as FetchError<ErroApiInterface>

    const mensagemUnico = err.response?._data?.errors?.descricao?.find(
      (msg: string) => msg.includes('único')
    );

    if(mensagemUnico) alertStore.mostrarAlerta('error', 'Esse almoxarifado ja foi cadastrado!')
  }
}

const buscarAlmoxarifado = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await materialAlmoxarifadoStore.fetchAlmoxarifados(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const almoxarifadosLocal = materialAlmoxarifadoStore.getAlmoxarifados
  if(
    !almoxarifadosLocal.items ||
    almoxarifadosLocal?.items?.length == 0
  ) await buscarAlmoxarifado()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-almoxarifado {
  .cadastrar-almoxarifado {
    height: 40px;
    width: 200px;
  }
}

</style>