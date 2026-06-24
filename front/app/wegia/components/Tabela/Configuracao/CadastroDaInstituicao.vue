<template>

  <section class="tabela-contato-da-instituicao">
    <tabela-schema
      titulo="Textos"
      :isLoading="false"
      :paginacao="null"
      :atualizacao="0"
      :mostrarPaginacao="false"
      :mostrarFiltros="false"
      :linhas="contatoInstituicao"
      :cabecalhos="[
        { nome: 'Descricao', chave: 'descricao', ordenavel: false },
        { nome: 'contato', chave: 'contato', ordenavel: false },
        { nome: 'Ação', chave: 'acao', ordenavel: false }
      ]"
      :acao="['editar', 'deletar']"
      @editar="toggleModal"
      @deletar="toggleModalDeletar"
    >

    <template #botoes>
      <Butao
        class="criar-contato"
        texto="Criar Contato"
        @click-botao="toggleModal"
      />
    </template>


    </tabela-schema>
  </section>

  <modal-cadastrar-configuracao-contatos-da-instituicao
    v-if="modalAberto"
    :contato="contatoEditar"
    @fechar-modal="toggleModal"
    @buscar="buscarContato"
  />

  <modal-confirmar-exclusao
    v-if="contatoDeletar"
    @confirmar="deletarContato"
    @fechar-modal="contatoDeletar = null"
  />

</template>

<script setup lang="ts">

const configuracaoContatoInstituicaoStore = useConfiguracaoContatoInstituicaoStore()

const alertStore = useAlertStore()

const contatoEditar      = ref<null | ConfiguracaoContatoInstituicaoInterface>(null)
const contatoDeletar     = ref<null | ConfiguracaoContatoInstituicaoInterface>(null)
const modalAberto        = ref(false)

const contatoInstituicao = computed(() => configuracaoContatoInstituicaoStore.getContatos)

const toggleModal = (contato: ConfiguracaoContatoInstituicaoInterface | null = null) => {
  modalAberto.value = !modalAberto.value
  contatoEditar.value = contato
}

const toggleModalDeletar = (contato: ConfiguracaoContatoInstituicaoInterface) => {contatoDeletar.value = contato}

const buscarContato = async () => {
  await configuracaoContatoInstituicaoStore.fetchContatos()
}


const deletarContato = async () => {

  if(!contatoDeletar.value) return

  try {

    await configuracaoContatoInstituicaoStore.fetchDeletarContato(contatoDeletar.value.id)
    alertStore.mostrarAlerta('success', `Contato deletado com sucesso!`)
    toggleModal()
  } catch (e) {
    alertStore.mostrarAlerta('error', `Erro ao deletar o contato!`)
  }

}

</script>

<style scoped lang="scss">
  .tabela-contato-da-instituicao {
    .criar-contato {
      height: 40px;
      width: 200px;
    }
  }
</style>