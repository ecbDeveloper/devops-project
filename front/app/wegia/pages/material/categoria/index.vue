<template>
  <section class="tabela-categoria">
    <tabela-schema
      titulo="Categoria"
      :isLoading="isLoading"
      :paginacao="categoriaPaginacao"
      :linhas="categorias"
      :cabecalhos="[
          { nome: 'Nome', chave: 'descricao', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false },
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @buscar="buscarCategoria"
      @editar="toggleAbrirModal"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_MATERIAL_CATEGORIA)"
          class="cadastrar-categoria"
          texto="Cadastrar Categoria"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>

    <modal-cadastrar-base-cadastro-texto
      v-if="abrirModal"
      :texto="categoriaEditar ? 'Editar Categoria' : 'Cadastrar Categoria'"
      :valorExistente="categoriaEditar?.descricao ?? ''"
      @fechar-modal="toggleAbrirModal"
      @enviar-modal="enviarCategoria"
    />
  </section>

</template>

<script setup lang="ts">

import type { FetchError } from 'ofetch'

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_CATEGORIA
})

const materialCategoriaStore = useMaterialCategoriaStore()
const pessoaStore = usePessoaStore()
const alertStore = useAlertStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const categoriaEditar = ref<MaterialCategoriaInterface | null>(null)
const abrirModal = ref(false)

const categoriaPaginacao = computed(() => materialCategoriaStore.getCategorias)
const categorias = computed(() => materialCategoriaStore?.getCategorias?.items ?? [])
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_CATEGORIA)) a.push('editar')

  return a
})

const toggleAbrirModal = (linha: MaterialCategoriaInterface | null = null) => {
  abrirModal.value = !abrirModal.value
  categoriaEditar.value = linha
}

const enviarCategoria = async (descricao: string) => {
  try {

    if(!descricao) return alertStore.mostrarAlerta('error', 'Cadastre um nome de categoria!')

    if(!categoriaEditar.value) {
      await materialCategoriaStore.fetchCadastrarCategoria({ descricao })
    } else {
      await materialCategoriaStore.fetchAtualizarCategoria(categoriaEditar.value.id_categoria, { descricao })
    }

    categoriaEditar.value = null
    abrirModal.value = false
    await buscarCategoria()

  } catch (e) {
    const err = e as FetchError<ErroApiInterface>

    const mensagemUnico = err.response?._data?.errors?.descricao?.find(
      (msg: string) => msg.includes('único')
    );

    if(mensagemUnico) alertStore.mostrarAlerta('error', 'Essa categoria ja foi cadastrado!')
  }
}

const buscarCategoria = async (params: Partial<PaginacaoDefaultParamsInterface> = {}) => {
  const paramsLocal: Partial<PaginacaoDefaultParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await materialCategoriaStore.fetchCategorias(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const categoriaLocal = materialCategoriaStore.getCategorias
  if(
    !categoriaLocal.items ||
    categoriaLocal?.items?.length == 0
  ) await buscarCategoria()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-categoria {
  .cadastrar-categoria {
    height: 40px;
    width: 200px;
  }
}

</style>