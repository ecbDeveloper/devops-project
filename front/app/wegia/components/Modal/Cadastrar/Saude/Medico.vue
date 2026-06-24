<template>
  <Modal @fechar-modal="emit('fechar-modal')" >
      <p >Cadastrar Novo Medico</p>

      <Forms
        :formulario="formulario"
        @enviar-formulario="enviar"
      />

  </Modal>

</template>

<script setup lang="ts">

import { cadastrarMedico, enviarMedico } from '@/forms/Saude/CadastrarMedico'

const emit = defineEmits(['fechar-modal', 'buscar'])

const formulario = ref(cadastrarMedico)

const enviar = async () => {
  try {
    const data = await enviarMedico(formulario.value)

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