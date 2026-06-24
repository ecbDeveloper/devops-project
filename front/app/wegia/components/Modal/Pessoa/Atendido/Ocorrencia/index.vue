<template>
  <Modal @fechar-modal="fecharModal">
    <CardPessoaAtendidoOcorrencia
      :ocorrencia="ocorrencia"
    />
  </Modal>
</template>

<script setup lang="ts">

defineProps<{
  ocorrencia: AtendidoOcorrenciaInterface
}>()

const emit = defineEmits(['fechar-modal'])

const fecharModal = () => {
  emit('fechar-modal')
}
</script>

<style lang="scss">
.modal {
  width: 720px;

  p {
    margin-bottom: 24px;
    font-size: 20px;
  }

  .butoes {
    justify-content: flex-end;
    display: flex;
    gap: 16px;

    button {
      width: 15%;
      height: 40px;
    }
  }
}
</style>
