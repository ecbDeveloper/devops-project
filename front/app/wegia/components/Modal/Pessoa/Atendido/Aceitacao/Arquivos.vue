<template>
  <Modal class="modal-atendido-aceitacao-arquivos" @fechar-modal="emit('fechar-modal')">

    <div class="arquivo">
      <input-file v-model="arquivo" />

      <butao
        texto="Enviar"
        @click-botao="emit('enviar-arquivo', arquivo)"
      />
    </div>

    <tabela-schema
      titulo="Aceitação de Atendidos"
      :linhas="arquivos ?? []"
      :cabecalhos="[
          { nome: 'Arquivo', chave: 'arquivo_nome', ordenavel: false },
          { nome: 'Data upload', chave: 'data_upload', ordenavel: false },
          { nome: 'Ações', chave: 'acao', ordenavel: false }
      ]"
      :mostrarPaginacao="false"
      :mostrarFiltros="false"
      :acao="['baixar']"
      @baixar="baixarArquivo"
    />

  </Modal>
</template>

<script setup lang="ts">

defineProps<{
  arquivos: AtendidoAceitacaoArquivoInterface[] | AtendidoAceitacaoEtapaArquivoInterface[]
}>()

const arquivo = ref<File | null>(null)

const emit = defineEmits(['fechar-modal', 'enviar-arquivo'])

const baixarArquivo = (linha: AtendidoAceitacaoArquivoInterface) => {
  baixarImagem(linha.arquivo, linha.arquivo_extensao, linha.arquivo_nome)
}
</script>

<style lang="scss">

.modal-atendido-aceitacao-arquivos {
  .modal {
    width: 1280px;

    .arquivo {
      align-items: flex-start;
      display: flex;
      gap: 16px;
      margin-top: 24px;
      margin-left: 48px;
      max-height: 48px;

      button {
        height: 48px;
        width: 120px;
      }
    }
  }
}
</style>
