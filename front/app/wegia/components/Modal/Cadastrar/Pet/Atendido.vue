<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Atendido</p>
      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />
  </Modal>
</template>

<script setup lang="ts">

import { cadastrarAtendimentoPet, enviarAtendimento } from '@/forms/pet/cadastrarAtendimentoPet'

const props = defineProps<{
  id_ficha_medica: number
}>()

const valor = ref('')
const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref(cadastrarAtendimentoPet)

const enviar = async () => {
  try {
    const data = await enviarAtendimento(formulario.value, props.id_ficha_medica)

    if(data?.status == 200){
      emit('buscar')
      emit('fechar-modal')
    }
  } catch(e) {
    console.error('Erro:', e)
    throw e
  }
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