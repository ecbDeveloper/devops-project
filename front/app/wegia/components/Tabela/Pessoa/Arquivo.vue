<template>
  <h2 class="sem-permissao" v-if="!pessoaStore.possuiPermissao(Permissao.VISUALIZAR_PESSOA_ARQUIVO)">Você não possui permissão!</h2>

  <SectionTabelaFiltroPaginacao
    v-else
    :cabecalhos="[
      { nome: 'Arquivo', chave: 'descricao', ordenavel: true },
      { nome: 'Data', chave: 'data', ordenavel: true },
      { nome: 'Ação', chave: 'acao', ordenavel: false },
    ]"
    :linhas="arquivos"
    :acao="acoes"
    :orderBy="orderBy"
    :buscar="buscar"
    :itensPorPagina="itensPorPagina"
    :paginaAtual="paginaAtual"
    :ultimaPagina="ultimaPagina"
    :totalItens="totalItens"
    :textoBotao="textoBotao"
    :botaoAparecer="pessoaStore.possuiPermissao(Permissao.CRIAR_PESSOA_ARQUIVO)"
    @click-botao="pessoaArquivoStore.setModal"
    @baixar="baixar"
    @excluir="excluir"
    @update:pagina-atual="paginaAtual = $event"
    @update:buscar="buscar = $event"
    @update:itens-por-pagina="itensPorPagina = $event"
    @update:order-by="orderBy = $event"
    @atualizar-todos-filtros="atualizarTodosFiltros"
  />


  <ModalCadastrarFuncionarioArquivo
    v-if="modalAberto"
    @enviar-modal="enviarArquivo"
    @fechar-modal="pessoaArquivoStore.setModal"
  />
</template>

<script setup lang="ts">

const props = defineProps({
  id_pessoa: {
    type: Number,
    required: true
  }
})

const pessoaArquivoStore = usePessoaArquivoStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const modalAberto = computed(() => pessoaArquivoStore.getModal)

const arquivos = computed(() => {
  const items = pessoaArquivoStore.getArquivos.items

  if (!items) return []

  return items.map((i) => {
    return {
      ...i,
      descricao: i?.tipo?.descricao
    }
  })
})
const acoes = computed(() => {
  const a = ['baixar']

  if (pessoaStore.possuiPermissao(Permissao.DELETAR_PESSOA_ARQUIVO)) {
    a.push('deletar')
  }

  return a
})

const orderBy = ref({ orderBy: 'descricao', tipoOrderBy: 'ASC' })
const buscar = ref('')
const itensPorPagina = ref(10)
const paginaAtual = ref(1)
const ultimaPagina = ref(1)
const totalItens = ref(10)

const textoBotao = computed(() => {
  return window.document.documentElement.clientWidth < 768 ? '+' : 'Adicionar Arquivo'
})

const baixar = (dados: PessoaArquivoInterface) => {
  baixarImagem(dados.arquivo, dados.extensao_arquivo, dados.nome_arquivo)
}

const excluir = (dado: PessoaArquivoInterface) => {
  pessoaArquivoStore.fetchExcluirArquivo(dado.id_pessoa_arquivo).then(async () => {
    await buscarArquivos()
    alertStore.mostrarAlerta('success', 'Arquivo deletado com sucesso!')
  }).catch(() => {
    alertStore.mostrarAlerta('error', 'Erro ao arquivo documento!')
  })
}

const enviarArquivo = async (dados: { arquivo: File, id_pessoa_tipo_arquivo: number }) => {
  const formData = new FormData();
  formData.append('arquivo', dados.arquivo)
  formData.append('id_pessoa_tipo_arquivo', String(dados.id_pessoa_tipo_arquivo))

  await pessoaArquivoStore.fetchCadastrarArquivo(props.id_pessoa, formData).then(async () => {
    await buscarArquivos()
    pessoaArquivoStore.setModal()
    alertStore.mostrarAlerta('success', 'Arquivo cadastrado com sucesso!')
  }).catch(() => {
    alertStore.mostrarAlerta('erro', 'Erro ao cadastrar arquivo!')
  })
}

const buscarArquivos = async () => {

    const params: Partial<PessoaArquivoBuscarPaginadoInterface> = {}

    if(buscar.value) params.buscar = buscar.value
     if(orderBy.value.orderBy) params.ordenacao = orderBy.value.orderBy
     if(orderBy.value.tipoOrderBy) params.tipoOrdenacao = orderBy.value.tipoOrderBy
     params.pagina = paginaAtual.value
     params.itensPorPagina = itensPorPagina.value

    await pessoaArquivoStore.fetchArquivos(props.id_pessoa, params).then(() => {
      const arquivoLocal = pessoaArquivoStore.getArquivos

      itensPorPagina.value = arquivoLocal.itensPorPagina
      paginaAtual.value = arquivoLocal.paginaAtual
      ultimaPagina.value = arquivoLocal.totalPaginas
      totalItens.value = arquivoLocal.totalItens
    })

}

const atualizarTodosFiltros = async (filtros: any) => {
  buscar.value = filtros.busca
  itensPorPagina.value = filtros.itensPorPagina
  orderBy.value = {
    orderBy: filtros.orderBy,
    tipoOrderBy: filtros.tipoOrderBy
  }
}

watch([buscar, itensPorPagina, paginaAtual, orderBy], async () => {
  await buscarArquivos()
})

onMounted(async () => {


  if (
    !pessoaArquivoStore.getArquivos.items ||
    pessoaArquivoStore.getArquivos.items[0].id_pessoa !== props.id_pessoa ||
    pessoaArquivoStore.getArquivos.paginaAtual !== 1
  ) {
    await buscarArquivos()
  }
})

</script>