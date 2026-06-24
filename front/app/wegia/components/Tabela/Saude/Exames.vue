<template>
  <section class="tabela-saude-exames">
    <tabela-schema
      :isLoading="isLoading"
      titulo="Comorbidades"
      :paginacao="examesCompleta"
      :linhas="exames"
      :cabecalhos="[
          { nome: 'Arquivo', chave: 'arquivo_nome', ordenavel: true },
          { nome: 'Data exame', chave: 'data', ordenavel: true },
          { nome: 'Descrição', chave: 'descricao', ordenavel: true },
          { nome: 'Acoes', chave: 'acao', ordenavel: false },
      ]"
      :acao="acao"
      :atualizacao="atualizarPagina"
      @buscar="buscarExames"
      @baixar="baixarArquivo"
      @excluir="excluirExame"
    >

      <template #botoes>
        <butao
          v-if="pessoaStore.possuiPermissao(Permissao.CRIAR_EXAME) && pessoaStore.possuiPermissao(Permissao.VISUALIZAR_TIPO_EXAME)"
          class="cadastrar-exames"
          texto="Cadastrar Exame"
          @click-botao="toggleAbrirModal"
        />
      </template>

    </tabela-schema>
  </section>

  <modal-cadastrar-saude-exame
    v-if="modalAberto"
    :id_fichamedica="fichaId"
    @fechar-modal="toggleAbrirModal"
    @buscar="atualizarPagina++"
  />

</template>

<script setup lang="ts">


const props = defineProps<{
  fichaId: number
}>()

const saudeExameStore = useSaudeExameStore()
const alertStore = useAlertStore()
const pessoaStore = usePessoaStore()

const isLoading = ref(true)
const atualizarPagina = ref(1)
const modalAberto = ref(false)

const examesCompleta = computed(() => saudeExameStore.getExames)
const exames = computed(() => {
  const examesLocal = saudeExameStore.getExames

  if(!examesLocal?.items?.length) return []

  return examesLocal.items.map((item : SaudeExameInterface) => {
    return {
      ...item,
      descricao: item?.tipo?.descricao
    }
  })
})
const acao = computed(() => {
  const a = ['baixar']

  if(pessoaStore.possuiPermissao(Permissao.DELETAR_EXAME)) a.push('deletar')

  return a
})


const toggleAbrirModal = () => { modalAberto.value = !modalAberto.value }

const baixarArquivo = (exame: SaudeExameInterface) => {
  baixarImagem(exame.arquivo, exame.arquivo_extensao, exame.arquivo_nome)
}

const excluirExame = async (exame: SaudeExameInterface) => {

  try {
    await saudeExameStore.fetchExameDeletar(exame.id_exame)
    alertStore.mostrarAlerta('success', 'Exame deletado com sucesso!')
    atualizarPagina.value++
  } catch (e) {
    alertStore.mostrarAlerta('error', 'Erro ao deletar o exame!')
  }
}

const buscarExames = async (params: Partial<SaudeExameBuscarTodosParamsInterface> = {}) => {
  const paramsLocal: Partial<SaudeExameBuscarTodosParamsInterface> = {}

  if(params.itensPorPagina) paramsLocal.itensPorPagina       = String(params.itensPorPagina)
  if(params.pagina) paramsLocal.pagina                       = String(params.pagina)
  if(params.buscar?.length) paramsLocal.buscar               = params.buscar
  if(params.ordenacao?.length) paramsLocal.ordenacao         = params.ordenacao
  if(params.tipoOrdenacao?.length) paramsLocal.tipoOrdenacao = params.tipoOrdenacao

  isLoading.value = true
  await saudeExameStore.fetchExames(props.fichaId, paramsLocal)
  isLoading.value = false
}

onMounted(async () => {
  const examesLocal = saudeExameStore.getExames
  if(
    !examesLocal.items ||
    examesLocal?.items?.length == 0 ||
    examesLocal?.items[0]?.id_fichamedica != props.fichaId
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