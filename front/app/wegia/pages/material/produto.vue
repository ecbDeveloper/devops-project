<template>
  <section class="tabela-saude-produto">
    <tabela-schema
      titulo="Produtos"
      :isLoading="isLoading"
      :paginacao="produtosPaginacao"
      :linhas="produtos"
      :cabecalhos="[
          { nome: 'Nome', chave: 'descricao', ordenavel: true },
          { nome: 'Código', chave: 'codigo', ordenavel: true },
          { nome: 'Categoria', chave: 'descricao_categoria', ordenavel: true },
          { nome: 'Unidade', chave: 'descricao_unidade', ordenavel: true },
          { nome: 'Ações', chave: 'acao', ordenavel: false }
      ]"
      :acao="acoes"
      :atualizacao="atualizarPagina"
      @editar="toggleAbrirModal"
      @buscar="buscarProdutos"
    >
      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_MATERIAL_PRODUTO)"
          class="cadastrar-produto"
          texto="Cadastrar Produto"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>
  </section>

  <modal-cadastrar-material-produto
    v-if="abrirModal"
    :produto="produtoAberto"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['permissao'],
  permission: Permissao.VISUALIZAR_MATERIAL_PRODUTO
})

const materialProdutoStore = useMaterialProdutoStore()
const pessoaStore          = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const abrirModal = ref(false)
const produtoAberto = ref<MaterialProdutoInterface | null>(null)

const produtosPaginacao = computed(() => materialProdutoStore.getProdutos)
const produtos = computed(() => {
  if(!materialProdutoStore.getProdutos?.items?.length) return []

  return materialProdutoStore.getProdutos.items.map(p => {
    return {
      ...p,
      descricao_categoria: p.categoria.descricao,
      descricao_unidade: p.unidade.descricao
    }
  })
})
const acoes = computed(() => {
  const a = []

  if(pessoaStore.possuiPermissao(Permissao.ATUALIZAR_MATERIAL_PRODUTO)) a.push('editar')

  return a
})

const toggleAbrirModal = (produto: MaterialProdutoInterface | null = null) => {
  produtoAberto.value = produto
  abrirModal.value = !abrirModal.value
}


const buscarProdutos = async (params: Partial<MaterialProdutobuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<MaterialProdutobuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await materialProdutoStore.fetchProdutos(paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const produtosLocal = materialProdutoStore.getProdutos
  if(
    !produtosLocal.items ||
    produtosLocal?.items?.length == 0
  ) await buscarProdutos()

  isLoading.value = false
})

</script>

<style lang="scss" scoped>

.tabela-saude-produto {
  .cadastrar-produto {
    height: 40px;
    width: 200px;
  }
}

</style>