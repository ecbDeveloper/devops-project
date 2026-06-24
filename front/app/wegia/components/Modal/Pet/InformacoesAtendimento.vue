<template>
  <Modal @fechar-modal="fecharModal" >
    <CardPetAtendimento
      :atendimento="atendimento"
    />
  </Modal>
</template>

<script setup lang="ts">


defineProps<{
  atendimento: PetAtendimentoInterface
}>()

const emit = defineEmits(['fechar-modal'])

const fecharModal = () => {
  emit('fechar-modal')
}

</script>

<style lang="scss">

.modal  {
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