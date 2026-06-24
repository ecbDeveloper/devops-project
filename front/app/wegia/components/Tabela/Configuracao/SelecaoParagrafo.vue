<template>

  <section>
    <tabela-schema
      titulo="Textos"
      :isLoading="false"
      :paginacao="null"
      :atualizacao="0"
      :mostrarPaginacao="false"
      :mostrarFiltros="false"
      :linhas="selecaoParagrafo"
      :cabecalhos="[
        { nome: 'Titulo', chave: 'nome_campo', ordenavel: false },
        { nome: 'Paragrafo', chave: 'paragrafo_cortado', ordenavel: false },
        { nome: 'Ação', chave: 'acao', ordenavel: false }
      ]"
      :acao="['editar']"
      @editar="toggleModal"
    />
  </section>

  <modal-cadastrar-base-cadastro-texto
    v-if="selecaoParagrafoEditar"
    :valorExistente="selecaoParagrafoEditar.paragrafo"
    type="textarea"
    texto="Editar o paragrafo"
    @fechar-modal="toggleModal"
    @enviar-modal="atualizarSelecaoParagrafo"
  />

</template>

<script setup lang="ts">

const configuracaoSelecaoParagrafoStore  = useConfiguracaoSelecaoParagrafoStore()
const alertStore = useAlertStore()

const selecaoParagrafoEditar = ref<null | ConfiguracaoSelecaoParagrafoInterface>(null)

const selecaoParagrafo = computed(() => configuracaoSelecaoParagrafoStore.getParagrafos.map(p => {
  const texto = p.paragrafo ?? "";

  return {
    ...p,
    "paragrafo_cortado":
      texto.length > 50
          ? texto.slice(0, 50) + "..."
          : texto
  }
}))

const toggleModal = (linha: ConfiguracaoSelecaoParagrafoInterface | null = null) => {
  selecaoParagrafoEditar.value = linha
}

const atualizarSelecaoParagrafo = async (texto: string) => {

  if(!selecaoParagrafoEditar.value) return

  try {
    await configuracaoSelecaoParagrafoStore.fetchAtualizarParagrafo(selecaoParagrafoEditar?.value?.id_selecao, { paragrafo: texto })
    alertStore.mostrarAlerta('success', `Paragrafo editado com sucesso!`)
    configuracaoSelecaoParagrafoStore.fetchParagrafos()
    toggleModal()
  } catch (e) {
    alertStore.mostrarAlerta('error', `Erro ao editar o paragrafo!`)
  }

}

</script>